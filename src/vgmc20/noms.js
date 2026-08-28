var FILTER = ['Votes','Unique','Game','Song','Link'];
var App = {graph: Viva.Graph.graph()};
var running = true;

function togglePause() {
  if (running) {
    App.renderer.pause();
    running = false;
  } else {
    App.renderer.resume();
    running = true;
  }
}

jQuery(document).ready(resetGraph());

function resetGraph() {
  if (App.renderer) {
    App.renderer.dispose();
    App.graph.clear();
  }

  jQuery.get("noms.csv", function(data) { makeNodes(data); });
}

function makeNodes(data) {
  let user_list = document.getElementById("user");
  let parse = jQuery.csv.toObjects(data);

  if (user_list.length == 0) {
    for (let header in parse[0]) {
      if (FILTER.includes(header)) {
        continue;
      }

      let user = document.createElement("option");
      user.value = header;
      user.innerHTML = header;
      user_list.add(user);
    }

    user_list.selectedIndex = Math.floor(Math.random() * user_list.length);
  }

  parse.forEach(function(row) {
    node_id = row['Song'];
    if (App.graph.getNode(node_id) !== undefined) {
      alert("Song name conflict, please fix in CSV: " + node_id)
    }
    App.graph.addNode(node_id, {type: 'song'}); 
  });

  makeLinks(data, user_list);
}

function makeLinks(data, user_list) {
  let min_shared = parseInt(document.getElementById("minshared").value);
  let max_shared = parseInt(document.getElementById("maxshared").value);
  let parse = jQuery.csv.toObjects(data);

  // linkArray is what will store the number of shared users for each pair of songs.
  let linkArray = new Array();

  // there are (at least) two assumptions here:
  // there is exactly one header row, immediately followed by data rows;
  // the csv does not create a jagged array.

  // the idea here is to sweep across the data from top to bottom, comparing each song's nominators to
  // all songs below them, and keeping a running tally of how many are shared.
  // we then add this data to linkArray and then add links based on our thresholds min_shared and max_shared.

  // we iterate across all song rows except the last.
  for (i = 0; i < parse.length-1; i++) {
    // we create and initialize a simple array to store lists of shared users, indexed against how far down
    // a given song is to the current song.
    let songArray = new Array(parse.length-i-1);
    for (idx = 0; idx < songArray.length; idx++) {
      songArray[idx] = [];
    }

    // we then go through each user.
    let user_list_match = false
    for (let header in parse[i]) {
      if (FILTER.includes(header)) {
        continue;
      }
      // when we encounter a user that nominated the current song, we then scan all songs below the
      // current song for other songs nominated by this user.
      // (we only scan below the current song, because we've already done all comparisons to songs above
      // the current song in previous loop iterations!)
      if (parse[i][header] > 0) {
        for (k = 1; k < parse.length-i; k++) {
          // if we find another song nominated by the user, we increment the value at the appropriate position.
          if (parse[i+k][header] > 0) {
            songArray[k-1].push(header);
          }
        }

        // Check for user highlighting
        if (!user_list_match && header == user_list.value) {
          user_list_match = true
        }
      }
    }

    App.graph.getNode(parse[i]['Song']).highlight = user_list_match;

    // finally, we add the shared user data for the current song to linkArray as several objects of the form
    // (song1, song2, shared song total), skipping any entries for which the shared user total is 0.
    for (n = 0; n < songArray.length; n++) {
      if (songArray[n].length > 0) {
        linkArray.push( {song1:parse[i]['Song'], song2:parse[i+n+1]['Song'], shared:songArray[n]} );
      }
    }
  };

  // we only add links to the graph if two songs are within the shared user threshold we defined above.
  linkArray.forEach(function(pair) {
    if (pair['shared'].length >= min_shared && pair['shared'].length <= max_shared) {
      App.graph.addLink(pair['song1'], pair['song2'], {'shared': pair['shared']});
    }
  });

  if (document.getElementById("toplinks").checked) {
    App.graph.forEachNode(function(node) {
      let links_to_add = [ {shared: []} ];

      linkArray.forEach(function(pair) {
        if (node.id == pair.song1 || node.id == pair.song2) {
          if (pair.shared.length > links_to_add[0].shared.length) {
            // Restart list
            links_to_add = [ {song1:pair.song1, song2:pair.song2, shared:pair.shared} ];
          } else if (pair.shared.length == links_to_add[0].shared.length) {
            links_to_add.push( {song1:pair.song1, song2:pair.song2, shared:pair.shared} );
          }
        }
      });

      if (links_to_add[0].shared.length > 0) {
        links_to_add.forEach(function(pair) {
          App.graph.addLink(pair.song1, pair.song2, {'shared': pair.shared});
        });
      }
    });
  }

  renderGraph();
}

function renderGraph() {
  var graphics = Viva.Graph.View.svgGraphics();
  var nodeSize = 2.5;

  graphics.node(function(node) {
    // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
    // Create SVG text element with user id as content
    var ui = Viva.Graph.svg('g');

    let nodeColour = "blue";
    if (node.highlight) { // Possibly overridden in mousedown
      nodeColour = "red";
    }

    var svgText = Viva.Graph.svg('text').attr('text-anchor', 'middle').attr('y', '-1px').attr('font-size', 12).text(node.id),
        svgNode = Viva.Graph.svg("circle").attr("r", nodeSize).attr("fill", nodeColour);

    ui.append(svgText);
    ui.append(svgNode);

    let specialSelected = document.getElementById("special").value;
    if (specialSelected === "linktoggle") {
      // Start with everything lightened, only show on click
      ui.attr('opacity', 0.4);

      $(ui).mousedown(function() {
        graphics.getNodeUI(node.id).attr('opacity', 1);
        App.graph.forEachLinkedNode(node.id, function(nbor, link) {
          graphics.getNodeUI(link.fromId).attr('opacity', 1);
          graphics.getNodeUI(link.toId).attr('opacity', 1);
          graphics.getLinkUI(link.id).attr('opacity', 1);

          document.getElementById('l' + link.id).attr('visibility', 'visible'); 
        });
      });

      return ui;
    }

    $(ui).hover(function() { // mouse on
      App.graph.forEachNode(function(node_hide) {
        graphics.getNodeUI(node_hide.id).attr('opacity', 0.4);
      });
      App.graph.forEachLink(function(link) {
        graphics.getLinkUI(link.id).attr('opacity', 0.4);
      });

      graphics.getNodeUI(node.id).attr('opacity', 1);
      App.graph.forEachLinkedNode(node.id, function(nbor, link) {
        graphics.getNodeUI(link.fromId).attr('opacity', 1);
        graphics.getNodeUI(link.toId).attr('opacity', 1);
        graphics.getLinkUI(link.id).attr('opacity', 1);

        document.getElementById('l' + link.id).attr('visibility', 'visible'); 
      });
    }, function() { // mouse off
      App.graph.forEachNode(function(node_hide) {
          graphics.getNodeUI(node_hide.id).attr('opacity', 1);
      });
      App.graph.forEachLink(function(link) {
        graphics.getLinkUI(link.id).attr('opacity', 1);
        document.getElementById('l' + link.id).attr('visibility', 'hidden'); 
      });
    });

    $(ui).mousedown(function() {
      if (specialSelected === "cull") {
        links_to_drop = [];
        App.graph.forEachLinkedNode(node.id, function(nbor, link) {
          links_to_drop.push(link);
        });
        links_to_drop.forEach(function(link) {
          App.graph.removeLink(link);
          // Reset visibility from hover's mouse on logic
          document.getElementById('l' + link.id).attr('visibility', 'hidden');
        });
      } else if (specialSelected === "highlight") {
        node_child = graphics.getNodeUI(node.id).children[1]// Gets the second call to ui.append
        node_child.attr('r', 4);
        node_child.attr('fill', 'chartreuse');
      }
    });

    return ui;
  }).placeNode(function(nodeUI, pos) {
    // 'g' element doesn't have convenient (x,y) attributes, instead
    // we have to deal with transforms: http://www.w3.org/TR/SVG/coords.html#SVGGlobalTransformAttribute
    nodeUI.attr('transform',
                'translate(' + pos.x + ',' + (pos.y - nodeSize/2) +
                ')');
  });

  graphics.link(function(link) {
    let label = Viva.Graph.svg('text').attr('id', 'l'+ link.id).attr('text-anchor', 'middle').attr('font-family', 'sans-serif').attr('font-size', 12).attr('visibility', 'hidden').text(link.data.shared.map(s => s.substring(0,8)));

    graphics.getSvgRoot().childNodes[0].append(label);

    let min_shared = parseInt(document.getElementById("minshared").value);
    if (link.data.shared.length >= min_shared) {
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
      springLength: 100,
      springCoeff: .0002,
      dragCoeff: .08,
      gravity: -5
    },
    "weak": {
      springLength: 100,
      springCoeff: .0001,
      dragCoeff: .08,
      gravity: -5
    },
    "strong": {
      springLength: 100,
      springCoeff: .0004,
      dragCoeff: .08,
      gravity: -5
    }
  };

  let layout = Viva.Graph.Layout.forceDirected(App.graph, springPhysics[springSelected]);

  // Render the graph
  App.renderer = Viva.Graph.View.renderer(App.graph, {
    layout: layout,
    graphics: graphics
  });

  App.renderer.run();
}
