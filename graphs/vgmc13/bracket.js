var MIN_VOTES = 150;
var MIN_WEIGHT = 0.6;
var LO = 1
var HI = 0

var PNODE = 'VGMC 13 Results';
var graph = Viva.Graph.graph();
graph.addNode(PNODE);

jQuery(document).ready(function() {
  jQuery.ajax({
    type: "GET",
    url: "https://p0p0p0p.github.io/graphs/vgmc13/nodes.csv",
    dataType: "text",
    success: function(data) {makeNodes(data);}
   });
});

function makeNodes(data) {
  let parse = jQuery.csv.toObjects(data);

  parse.forEach(function(row) {
    if (row['Matches'] >= MIN_VOTES) {
      graph.addNode(row['Name']);
      str = Number(row['Strength']);
      if (str >= MIN_WEIGHT) {
        graph.addLink(PNODE, row['Name'], {strength: str});
        if (str < LO) {
          LO = str;
        }
        if (str > HI) {
          HI = str;
        }
      }
    }
  });

  jQuery.ajax({
    type: "GET",
    url: "https://p0p0p0p.github.io/graphs/vgmc13/links.csv",
    dataType: "text",
    success: function(data) {makeLinks(data);}
   });
}

function makeLinks(data) {
  let parse = jQuery.csv.toObjects(data);

  parse.forEach(function(row) {
    if (graph.getNode(row['Name1']) && graph.getNode(row['Name2'])) {
      str = Number(row['Strength']);
      if (row['Strength'] >= MIN_WEIGHT) {
        graph.addLink(row['Name1'], row['Name2'], {strength: str});
        if (str < LO) {
          LO = str;
        }
        if (str > HI) {
          HI = str;
        }
      }
    }
  });

  renderGraph();
}

function renderGraph() {
  var graphics = Viva.Graph.View.svgGraphics();
  var nodeSize = 6;
  graph.getNode(PNODE).isPinned = true;

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
      springLength : 10,
      springCoeff : 0.0002,
      dragCoeff : .08,
      gravity : -10,
      springTransform: function (link, spring) {
        spring.length = 200 * (1 - (link.data.strength-LO)/(HI-LO));
      }
  });

  // Render the graph
  var renderer = Viva.Graph.View.renderer(graph, {
        layout : layout,
        graphics : graphics
      });

  renderer.run();
}
