var FILTER = ['ID','Song A','Song B','Votes A','Votes B','Total','Margin'];
var App = {graph: Viva.Graph.graph()};
var PNODE = {field: 'Winner', label: 'RESULTS'};
var MIN_RATIO = 0.0;
var MAX_RATIO = 0.0;

jQuery(document).ready(resetGraph());

function resetGraph() {
  if (App.renderer) {
    App.renderer.dispose();
    App.graph.clear();
  }

  jQuery.ajax({
    type: "GET",
    url: "https://p0p0p0p.github.io/graphs/vgmc14/results.csv",
    dataType: "text",
    success: function(data) { makeNodes(data); }
  });
}

function makeNodes(data) {
  let min_voting = document.getElementById("minvoting").value;
  let parse = jQuery.csv.toObjects(data);
  let totals = {};

  for (let header in parse[0]) {
    if (header && !FILTER.includes(header)) {
      totals[header] = 0;
    }
  }

  parse.forEach(function(row) {
    for (let key in totals) {
      if (row[key]) {
        ++totals[key];
      }
    }
  });

  document.getElementById("update").textContent = "Updated through match " + totals[PNODE.field] + " (Red/Blue = Endeavour/Isoleucine finals vote)";

  for (let key in totals) {
    if (totals[key] / totals[PNODE.field] >= min_voting) {
      App.graph.addNode(key);
      if (parse[parse.length-1][key]) {
        if (parse[parse.length-1][key] == parse[parse.length-1]['Winner']) {
          App.graph.getNode(key).data = 1;
        } else {
          App.graph.getNode(key).data = 0;
        }
      }
    }
  }

  jQuery.ajax({
    type: "GET",
    url: "https://p0p0p0p.github.io/graphs/vgmc14/results.csv",
    dataType: "text",
    success: function(data) { makeLinks(data); }
   });
}

function makeLinks(data) {
  MIN_RATIO = document.getElementById("minratio").value;
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

  renderGraph();
}

function renderGraph() {
  var graphics = Viva.Graph.View.svgGraphics();
  var nodeSize = 3;
  App.graph.getNode(PNODE.field).isPinned = true;

  graphics.node(function(node) {
    // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
    // Create SVG text element with user id as content
    var ui = Viva.Graph.svg('g');

    var svgText = Viva.Graph.svg('text').attr('text-anchor', 'middle').attr('y', '-4px').text(node.id),
        svgNode = Viva.Graph.svg("circle").attr("r", nodeSize).attr("fill", "#999999");

    if (node.id == PNODE.field) {
      svgText = Viva.Graph.svg('text').attr('text-anchor', 'middle').attr('y', '-4px').text(PNODE.label);
    }

    if (node.data == 1) {
      svgNode = Viva.Graph.svg("circle").attr("r", nodeSize).attr("fill", "#e00000");
    } else if (node.data == 0) {
      svgNode = Viva.Graph.svg("circle").attr("r", nodeSize).attr("fill", "#0000e0");
    }

    ui.append(svgText);
    ui.append(svgNode);
    return ui;
  }).placeNode(function(nodeUI, pos) {
    // 'g' element doesn't have convenient (x,y) attributes, instead
    // we have to deal with transforms: http://www.w3.org/TR/SVG/coords.html#SVGGlobalTransformAttribute
    nodeUI.attr('transform',
                'translate(' + pos.x + ',' + (pos.y - nodeSize/2) +
                ')');
  });

  var layout = Viva.Graph.Layout.forceDirected(App.graph, {
    springLength: 10,
    springCoeff: 0.0002,
    dragCoeff: .08,
    gravity: -10,
    springTransform: function (link, spring) {
      spring.length = 200 * (1 - (link.data.ratio-MIN_RATIO)/Math.max(MAX_RATIO-MIN_RATIO, 0.01));
    }
  });

  // Render the graph
  App.renderer = Viva.Graph.View.renderer(App.graph, {
    layout: layout,
    graphics: graphics
  });

  App.renderer.run();
}
