var MIN_VOTES = 150;
var MIN_WEIGHT = 0.2;
var LO = 1
var HI = 0

var PNODE = 'VGMC 13 Results';
var graph = Viva.Graph.graph();
var graphics = Viva.Graph.View.svgGraphics();
graph.addNode(PNODE);

$(document).ready(function() {
  /*$.ajax({
    type: "GET",
    url: "data/voters.csv",
    dataType: "text",
    success: function(data) {makeNodes(data);}
   });*/
  makeNodes("Name,Matches,Strength\nAdvokaiser,191,0.66\nAkkrillic,151,0.66\n");
});

function makeNodes(data) {
  parse = $.csv.toObjects(data);

  parse.forEach(function(row) {
    console.log(row['Name']);
    if (row['Matches'] >= MIN_VOTES) {
      graph.addNode(row['Name']);
      if (row['Strength'] >= MIN_WEIGHT) {
        graph.addLink(PNODE, row['Name'], {strength: Number(row['Strength'])});
      }
      if (row['Strength'] < LO) {
        LO = Number(row['Strength']);
      }
      if (row['Strength'] > HI) {
        HI = Number(row['Strength']);
      }
    }
  });

  /*$.ajax({
    type: "GET",
    url: "data/voters.csv",
    dataType: "text",
    success: function(data) {makeNodes(data);}
   });*/
   makeLinks("Name1,Name2,Strength,Shared\nazuarc,Advokaiser,0.582,184\nbanana,Arti,0.32,50\n");
}

function makeLinks(data) {
  parse = $.csv.toObjects(data);

  parse.forEach(function(row) {
      if (row['Strength'] >= MIN_WEIGHT) {
        graph.addLink(row['Name1'], row['Name2'], {strength: Number(row['Strength'])});
        console.log(row['Name1']);
      }
      if (row['Strength'] < LO) {
        LO = Number(row['Strength']);
      }
      if (row['Strength'] > HI) {
        HI = Number(row['Strength']);
      }
  });

  renderGraph();
}

function renderGraph() {
  graph.getNode(PNODE).isPinned = true;

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
      springLength : 10,
      springCoeff : 0.0008,
      dragCoeff : .08,
      gravity : -10,
      springTransform: function (link, spring) {
        spring.length = 500 * (1 - (link.data.strength-LO)/(HI-LO));
      }
  });

  // Render the graph
  var renderer = Viva.Graph.View.renderer(graph, {
        layout : layout,
        graphics : graphics
      });

  renderer.run();
}
