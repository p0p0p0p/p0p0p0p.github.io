var App = {graph: Viva.Graph.graph()};
var FILTER = [];
var PNODE = {field: 'Winner', label: 'RESULTS'};
var MIN_RATIO = 0.0;
var MAX_RATIO = 0.0;

jQuery(document).ready(resetGraph());

function resetGraph() {
  if (App.renderer) {
    App.renderer.dispose();
    App.graph.clear();
  }

  jQuery.get("results.csv", function(data) { makeNodes(data); });
}

function makeNodes(data) {
  if (document.getElementById("showresults").checked) {
    FILTER = ['ID','Song A','Song B','Votes A','Votes B','Total','Margin'];
  } else {
    FILTER = ['ID','Song A','Song B','Votes A','Votes B','Total','Margin',PNODE.field];
  }
  let min_voting = document.getElementById("minvoting").value/100;
  let match_colours = document.getElementById("match");
  let parse = jQuery.csv.toObjects(data);
  let voterStats = {};
  let max_ID = 0;

  for (let header in parse[0]) {
    if (header && !FILTER.includes(header)) {
      voterStats[header] = { total: 0, match: -1 };
    }
  }

  if (match_colours.length == 0) {
    parse.forEach(function(row) {
      let match = document.createElement("option");
      match.value = row.ID;
      match.innerHTML = row.ID + " " + row['Song A'] + " / " + row['Song B'];
      match_colours.add(match);
    });
    match_colours.selectedIndex = match_colours.length - 1;
  }

  parse.forEach(function(row) {
    max_ID = row.ID;
    for (let key in voterStats) {
      if (row[key]) {
        ++voterStats[key].total;

        if (row.ID != match_colours.value) {
          continue;
        }
        if (row[key] == row['Song A']) {
          voterStats[key].match = 0;
        } else if (row[key] == row['Song B']) {
          voterStats[key].match = 1;
        }
      }
    }
  });

  document.getElementById("update").textContent = "Updated through match " + max_ID;

  for (let key in voterStats) {
    if (voterStats[key].total / max_ID >= min_voting) {
      App.graph.addNode(key);
      App.graph.getNode(key).vote = voterStats[key].match;
    }
  }

  if (document.getElementById("showresults").checked) {
    App.graph.getNode(PNODE.field).isPinned = true;
  }
  makeLinks(data);
}

function makeLinks(data) {
  MIN_RATIO = document.getElementById("minratio").value/100;
  let parse = jQuery.csv.toArrays(data);

  // linkArray is what will store the compatibility between each pair of users.
  let linkArray = new Array();

  // there are (at least) two assumptions here:
  // all filtered (i.e. non-user) columns are to the left of all users;
  // the csv does not create a jagged array.

  // the idea here is to sweep across the data from left to right, comparing each user's votes to
  // all users to the right of them, and keeping a running tally of how many are shared.
  // we then add this data to linkArray and then add links based on our threshold value MIN_RATIO.

  // we iterate across all user columns except the last, starting with the leftmost user.
  for(i = FILTER.length; i < parse[0].length-1; i++) {
    // we create and initialize an array of objects to store number of shared votes, indexed against
    // how far to the right a given user is to the current user.
    let userArray = new Array(parse[0].length-i-1);
    for (let i = 0; i < userArray.length; ++i) {
      userArray[i] = {matching: 0, total: 0};
    }

    // we then go through each completed match from the bracket.
    for(j = 1; j < parse.length; j++) {
      // when we encounter a match that the current user voted in, we then scan all users to the right of the
      // current user for other users that also voted in this match.
      // (we only scan to the right of the current user, because we've already done all comparisons to users to the
      // left of the current user in previous loop iterations!)
      if(parse[j][i]) {
        for(k = 1; k < parse[0].length-i; k++) {
          // if we find another user that voted in the match, we increment the appropriate value(s).
          if (parse[j][i+k]) {
            ++userArray[k-1].total;
            if (parse[j][i+k] == parse[j][i]) {
              ++userArray[k-1].matching;
            }
          }
        }
      }
    }
    // finally, we add the shared voting data for the current user to linkArray as several objects of the form
    // (user1, user2, compatibility), skipping any entries for which either user did not meet the required
    // participation or no matches overlapped.
    for(n = 0; n < userArray.length; n++) {
      if(App.graph.getNode(parse[0][i]) && App.graph.getNode(parse[0][i+n+1]) && userArray[n].total > 0) {
        linkArray.push({user1: parse[0][i],
                        user2: parse[0][i+n+1],
                        ratio: userArray[n].matching / userArray[n].total});
      }
    }
  }

  // we only add links to the graph if two users reach or exceed the compatibility threshold defined by the input.
  linkArray.forEach(function(pair) {
    if (pair.ratio >= MIN_RATIO) {
      App.graph.addLink(pair.user1, pair.user2, {ratio: pair.ratio});
      if (pair.ratio > MAX_RATIO) {
        MAX_RATIO = pair.ratio;
      }
    }
  });

  if (document.getElementById("toplinks").checked) {
    App.graph.forEachNode(function(node) {
      let max_ratio = {ratio: 0};
      linkArray.forEach(function(pair) {
        if (node.id == pair.user1 || node.id == pair.user2) {
          if (pair.ratio > max_ratio.ratio) {
            max_ratio.user1 = pair.user1;
            max_ratio.user2 = pair.user2;
            max_ratio.ratio = pair.ratio;
          }
        }
      });
      if (max_ratio.ratio > 0) {
        App.graph.addLink(max_ratio.user1, max_ratio.user2, {'ratio': max_ratio.ratio});
      }
    });
  }

  renderGraph();
}

function renderGraph() {
  var graphics = Viva.Graph.View.svgGraphics();
  var nodeSize = 3;

 graphics.node(function(node) {
    // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
    // Create SVG text element with user id as content
    var ui = Viva.Graph.svg('g');

    let nodeColour = "silver";

    if (node.vote == 0) {
      nodeColour = "red";
    } else if (node.vote == 1) {
      nodeColour = "blue";
    }

    var svgNode = Viva.Graph.svg("circle").attr("r", 2.5).attr("fill", nodeColour);
    var svgText = Viva.Graph.svg('text').attr('text-anchor', 'middle').attr('font-family', 'sans-serif').text(node.id == PNODE.field ? PNODE.label : node.id);

    ui.append(svgNode);
    ui.append(svgText);

    $(ui).hover(function() { // mouse on
      App.graph.forEachNode(function(node_hide) {
        graphics.getNodeUI(node_hide.id).attr('opacity', '0.4');
      });
      App.graph.forEachLink(function(link) {
        graphics.getLinkUI(link.id).attr('opacity', '0.4');
      });

      graphics.getNodeUI(node.id).attr('opacity', '1');
      App.graph.forEachLinkedNode(node.id, function(nbor, link) {
        graphics.getNodeUI(link.fromId).attr('opacity', '1');
        graphics.getNodeUI(link.toId).attr('opacity', '1');
        graphics.getLinkUI(link.id).attr('opacity', '1');
        document.getElementById('l' + link.id).attr('visibility', 'visible'); 
      });
    }, function() { // mouse off
      App.graph.forEachNode(function(node_hide) {
          graphics.getNodeUI(node_hide.id).attr('opacity', '1');
      });
      App.graph.forEachLink(function(link) {
        graphics.getLinkUI(link.id).attr('opacity', '1');
        document.getElementById('l' + link.id).attr('visibility', 'hidden'); 
      });
    });

    return ui;
  }).placeNode(function(nodeUI, pos) {
    // 'g' element doesn't have convenient (x,y) attributes, instead
    // we have to deal with transforms: http://www.w3.org/TR/SVG/coords.html#SVGGlobalTransformAttribute
    nodeUI.attr('transform', 'translate(' + pos.x + ',' + pos.y + ')');
  });

  graphics.link(function(link) {
    let label = Viva.Graph.svg('text').attr('id', 'l' + link.id).attr('text-anchor', 'middle').attr('font-family', 'sans-serif').attr('visibility', 'hidden').text((link.data.ratio*100).toFixed(1));
    graphics.getSvgRoot().childNodes[0].append(label);

    if (link.data.ratio >= MIN_RATIO) {
      return Viva.Graph.svg("line").attr("stroke", "grey").attr('id', link.id);
    } else {
      return Viva.Graph.svg("line").attr("stroke", "grey").attr('stroke-dasharray', '2 4').attr('id', link.id);
    }
  }).placeLink(function(linkUI, fromPos, toPos) {
    linkUI.attr("x1", fromPos.x)
          .attr("y1", fromPos.y)
          .attr("x2", toPos.x)
          .attr("y2", toPos.y);
    document.getElementById('l' + linkUI.attr('id')).attr('x', (fromPos.x+toPos.x) / 2).attr('y', (fromPos.y+toPos.y) / 2); 
  });

  let springSelected = document.getElementById("spring").value;
  let springPhysics = {
    "normal": {
      springCoeff: .0002,
      dragCoeff: .08,
      gravity: -5,
      springTransform: function (link, spring) {
        spring.length = 100 * (1 - (Math.max(link.data.ratio, MIN_RATIO)-MIN_RATIO)/Math.max(MAX_RATIO-MIN_RATIO, 0.01));
      }
    },
    "weak": {
      springCoeff: .0001,
      dragCoeff: .08,
      gravity: -5,
      springTransform: function (link, spring) {
        spring.length = 400 * (1 - (Math.max(link.data.ratio, MIN_RATIO)-MIN_RATIO)/Math.max(MAX_RATIO-MIN_RATIO, 0.01));
      }
    },
    "strong": {
      springCoeff: .0004,
      dragCoeff: .08,
      gravity: -5,
      springTransform: function (link, spring) {
        spring.length = 50 * (1 - (Math.max(link.data.ratio, MIN_RATIO)-MIN_RATIO)/Math.max(MAX_RATIO-MIN_RATIO, 0.01));
      }
    }
  };

  let layout = Viva.Graph.Layout.forceDirected(App.graph, springPhysics[springSelected]);

  /*
    for (var i = 0; i < 1000; ++i) {
    layout.step();
  }
  */
  
  // Render the graph
  App.renderer = Viva.Graph.View.renderer(App.graph, {
    layout: layout,
    graphics: graphics
  });

  App.renderer.run();
}