var MIN_SHARED = 3;
var FILTER = ['Votes','Unique','Game','Song','Link'];
var graph = Viva.Graph.graph();

jQuery(document).ready(function() {
  jQuery.ajax({
    type: "GET",
    url: "https://p0p0p0p.github.io/js/data/vgmc14/bracket.csv",
    dataType: "text",
    success: function(data) {makeNodes(data);}
   });
});

function makeNodes(data) {
  parse = jQuery.csv.toObjects(data)[0];

  for (let header in parse) {
    if (!FILTER.includes(header)) {
      graph.addNode(header, {type: 'user'});
    }
  }

  jQuery.ajax({
    type: "GET",
    url: "https://p0p0p0p.github.io/js/data/vgmc14/bracket.csv",
    dataType: "text",
    success: function(data) {makeLinks(data);}
   });
}

function makeLinks(data) {
  parse = jQuery.csv.toArrays(data);
  // linkArray is what will store the number of shared noms for each pair of users.
  let linkArray = new Array();

  // there are (at least) two assumptions here:
  // all filtered (i.e. non-user) columns are to the left of all users;
  // the csv does not create a jagged array.

  // the idea here is to sweep across the data from left to right, comparing each user's nominations to
  // all users to the right of them, and keeping a running tally of how many are shared.
  // we then add this data to linkArray and then add links based on our threshold value MIN_SHARED.

  // we iterate across all user columns, starting with the leftmost user.
  for(i = FILTER.length; i < parse[0].length-1; i++) {
    // we create and initialize a simple array to store number of shared noms, indexed against how far to the right
    // a given user is to the current user.
    let userArray = new Array(parse[0].length-i-1);
    userArray.fill(0);
    // we then go through each track that made it into the contest.
    for(j = 1; j < parse.length; j++) {
      // when we encounter a track that the current user nominated, we then scan all users to the right of the
      // current user for other users that also nominated this track.
      // (we only scan to the right of the current user, because we've already done all comparisons to users to the
      // left of the current user in previous loop iterations!)
      if(parse[j][i] > 0) {
        for(k = 1; k < parse[0].length-i; k++) {
          // if we find another user that nominated the track, we increment the value at the appropriate position.
          if(parse[j][i+k] > 0) {
            userArray[k-1]++;
          }
        }
      }
    }
    // finally, we add the shared nom data for the current user to linkArray as several objects of the form
    // (user1, user2, shared nom total), skipping any entries for which the shared nom total is 0.
    for(n = 0; n < userArray.length; n++) {
      if(userArray[n] > 0) {
        linkArray.push({user1:parse[0][i],user2:parse[0][i+n+1],shared:userArray[n]});
      }
    }
  }

  // we only add links to the graph if two users reach or exceed the shared nom threshold we defined above.
  linkArray.forEach(function(pair) {
    if (pair['shared'] >= MIN_SHARED) {
      graph.addLink(pair['user1'], pair['user2'], {'shared': pair['shared']});
    }
  });

  renderGraph();
}

function renderGraph() {
  var graphics = Viva.Graph.View.svgGraphics();
  var nodeSize = 4;
  // graph.getNode(PNODE).isPinned = true;

  graphics.node(function(node) {
    // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
    var ui = Viva.Graph.svg('g'),
        // Create SVG text element with user id as content
        svgText = Viva.Graph.svg('text').attr('text-anchor', 'middle').attr('y', '-4px').text(node.id);
        svgNode = Viva.Graph.svg("circle").attr("r", nodeSize).attr("fill", "#e00000");
        
    if (node.data.type == 'song') {
      svgText = Viva.Graph.svg('text').attr('text-anchor', 'middle').attr('y', '-1px').attr('font-size', 12).text(node.id);
      svgNode = Viva.Graph.svg("rect").attr("width", nodeSize).attr("height", nodeSize).attr("fill", "#0000e0");
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

  var layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength : 10,
      springCoeff : 0.0002,
      dragCoeff : .08,
      gravity : -10,
      springTransform: function (link, spring) {
        spring.length = 100 * (1 - (link.data.shared-3)/(8-3));
      }
  });

  // Render the graph
  var renderer = Viva.Graph.View.renderer(graph, {
    layout : layout,
    graphics : graphics
  });

  renderer.run();
}
