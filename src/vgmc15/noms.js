var FILTER = ['Votes','Unique','Game','Song','Link'];
var App = {graph: Viva.Graph.graph()};
jQuery(document).ready(resetGraph());

function resetGraph() {
  if (App.renderer) {
    App.renderer.dispose();
    App.graph.clear();
  }

  document.getElementById("update").textContent = "Updated through 2-22";

  jQuery.ajax({
    type: "GET",
    url: "https://p0p0p0p.github.io/src/vgmc15/noms.csv",
    dataType: "text",
    success: function(data) { makeNodes(data); }
   });
}

function makeNodes(data) {
  let parse = jQuery.csv.toObjects(data)[0];

  for (let header in parse) {
    if (!FILTER.includes(header)) {
      App.graph.addNode(header, {type: 'user'});
    }
  }

  jQuery.ajax({
    type: "GET",
    url: "https://p0p0p0p.github.io/src/vgmc15/noms.csv",
    dataType: "text",
    success: function(data) { makeLinks(data); }
   });
}

function makeLinks(data) {
  let min_unique = document.getElementById("minunique").value;
  let parse = jQuery.csv.toObjects(data);

  parse.forEach(function(row) {
    title = row['Song'];
    if (row['Unique'] >= min_unique) {
      App.graph.addNode(title, {type: 'song'});
      for (let header in row) {
        if (!FILTER.includes(header) && row[header] >= 1) {
          App.graph.addLink(title, header);
        }
      }
    }
  });

  renderGraph();
}

function renderGraph() {
  var graphics = Viva.Graph.View.svgGraphics();
  var nodeSize = 4;

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

  var layout = Viva.Graph.Layout.forceDirected(App.graph, {
    springLength: 100,
    springCoeff: 0.00004,
    dragCoeff: .08,
    gravity: -10,
  });

  // Render the graph
  App.renderer = Viva.Graph.View.renderer(App.graph, {
    layout: layout,
    graphics: graphics
  });

  App.renderer.run();
}
