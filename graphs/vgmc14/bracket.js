var FILTER = ['ID','Song A','Song B','Votes A','Votes B','Total','Margin','Winner'];
var MAJORITY = 1;
var graph = Viva.Graph.graph();
var PNODE = 'RESULTS';

jQuery(document).ready(function() {
  jQuery.ajax({
    type: "GET",
    url: "https://p0p0p0p.github.io/graphs/vgmc14/results.csv",
    dataType: "text",
    success: function(data) { makeNodes(data); }
   });
});

function makeNodes(data) {
  let parse = jQuery.csv.toObjects(data)[0];
  graph.addNode(PNODE, {type: 'user'});

  for (let header in parse) {
    if (header && !FILTER.includes(header)) {
      graph.addNode(header, {type: 'user'});
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
  let parse = jQuery.csv.toObjects(data);

  parse.forEach(function(row) {
    let title = row['Song A'];
    graph.addNode(title, {type: 'song'});
    title = row['Song B'];
    graph.addNode(title, {type: 'song'});

    var majority_song = "";
    if (row['Votes A']/row['Total'] >= MAJORITY) {
      majority_song = row['Song A'];
    } else if (row['Votes B']/row['Total'] >= MAJORITY) {
      majority_song = row['Song B'];
    }

    for (let header in row) {
      if (header == 'Winner') {
        graph.addLink(PNODE, row[header]);
      } else if (header && !FILTER.includes(header)) {
        title = row[header];
        if (title && title != majority_song) {
          graph.addLink(header, title);
        }
      }
    }
  });

  renderGraph();
}

function renderGraph() {
  var graphics = Viva.Graph.View.svgGraphics();
  var nodeSize = 4;
  //graph.getNode(PNODE).isPinned = true;

  graphics.node(function(node) {
    // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
    // Create SVG text element with user id as content
    var ui = Viva.Graph.svg('g');

    var svgText = Viva.Graph.svg('text').attr('text-anchor', 'middle').attr('y', '-4px').text(node.id),
        svgNode = Viva.Graph.svg("circle").attr("r", nodeSize).attr("fill", "#e00000");
    if (node.data.type == 'song') {
      var svgText = Viva.Graph.svg('text').attr('text-anchor', 'middle').attr('y', '-1px').attr('font-size', 12).text(node.id),
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
    springLength: 10,
    springCoeff: 0.00002,
    dragCoeff: .08,
    gravity: -8,
  });

  // Render the graph
  var renderer = Viva.Graph.View.renderer(graph, {
    layout: layout,
    graphics: graphics
  });

  renderer.run();
}
