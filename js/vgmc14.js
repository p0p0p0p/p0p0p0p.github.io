var graph = Viva.Graph.graph();

jQuery(document).ready(function() {
  jQuery.ajax({
    type: "GET",
    url: "https://p0p0p0p.github.io/js/data/noms14.csv",
    dataType: "text",
    success: function(data) {makeNodes(data);}
   });
});

function makeNodes(data) {
  parse = jQuery.csv.toObjects(data)[0];

  for (let header in parse) {
    filter = ['Votes','Unique','Game','Song','Link'];
    if (!filter.includes(header)) {
      graph.addNode(header);
    }
  }

  jQuery.ajax({
    type: "GET",
    url: "https://p0p0p0p.github.io/js/data/noms14.csv",
    dataType: "text",
    success: function(data) {makeLinks(data);}
   });
}

function makeLinks(data) {
  parse = jQuery.csv.toObjects(data);

  parse.forEach(function(row) {
    title = row['Song'];
    for (let header in row) {
      if (header != 'Song' && row[header] == 1) {
        graph.addLink(row['Song'], header)
      }
    }
  });

  renderGraph();
}

function renderGraph() {
  var graphics = Viva.Graph.View.svgGraphics();
  var nodeSize = 6;

  graphics.node(function(node) {
    // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
    var ui = Viva.Graph.svg('g'),
        // Create SVG text element with user id as content
        svgText = Viva.Graph.svg('text').attr('y', '0px').text(node.id);
        svgNode = Viva.Graph.svg("rect").attr("width", nodeSize).attr("height", nodeSize).attr("fill", "#e00000");

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
      springLength : 500,
      springCoeff : 0.0008,
      dragCoeff : .08,
      gravity : -10,
  });

  // Render the graph
  var renderer = Viva.Graph.View.renderer(graph, {
    layout : layout,
    graphics : graphics
  });

  renderer.run();
}
