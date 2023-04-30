var FILTER = ['Votes','Unique','Game','Song','Link'];
var App = {graph: Viva.Graph.graph()};
var running = true;

jQuery(document).ready(resetGraph());

function resetGraph() {
  if (App.renderer) {
    App.renderer.dispose();
    App.graph.clear();
  }

  jQuery.get("noms.csv", function(data) { makeNodes(data); });
}

function makeNodes(data) {
  let parse = jQuery.csv.toObjects(data);

  parse.forEach(function(row) {
    title = row['Song'];
    App.graph.addNode(row['Song'], {type: 'song'});
  });

  makeLinks(data);
}

function makeLinks(data) {
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
      }
    }

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
      let max_shared = [ {shared: []} ];

      linkArray.forEach(function(pair) {
        if (node.id == pair.song1 || node.id == pair.song2) {
          if (pair.shared.length > max_shared[0].shared.length) {
            max_shared = [ {song1:pair.song1, song2:pair.song2, shared:pair.shared} ];
          } else if (pair.shared.length == max_shared[0].shared.length) {
            max_shared.push( {song1:pair.song1, song2:pair.song2, shared:pair.shared} );
          }
        }
      });

      if (max_shared[0].shared.length > 0) {
        max_shared.forEach(function(pair) {
          App.graph.addLink(pair.song1, pair.song2, {'shared': pair.shared});
        });
      }
    });
  }

  renderGraph();
}

function renderGraph() {
  var graphics = Viva.Graph.View.svgGraphics();
  var nodeSize = 4;

  graphics.node(function(node) {
    // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
    // Create SVG text element with user id as content
    var ui = Viva.Graph.svg('g');

    var svgText = Viva.Graph.svg('text').attr('text-anchor', 'middle').attr('y', '-1px').attr('font-size', 12).text(node.id),
        svgNode = Viva.Graph.svg("rect").attr("width", nodeSize).attr("height", nodeSize).attr("fill", "#0000e0");

    ui.append(svgText);
    ui.append(svgNode);

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

function togglePause() {
  if (running) {
    App.renderer.pause();
    running = false;
  } else {
    App.renderer.resume();
    running = true;
  }
}
