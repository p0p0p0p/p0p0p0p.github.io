// This demo shows how to create an SVG node which is a bit more complex
// than single image. Do accomplish this we use 'g' element and
// compose group of elements to represent a node.
var graph = Viva.Graph.graph();

var graphics = Viva.Graph.View.svgGraphics();

graph.addNode('VGMC Results');
graph.addNode('Advokaiser');
graph.addNode('Akkrillic');
graph.addNode('Arti');
graph.addNode('azuarc');
graph.addNode('Baconus_Yum');
graph.addNode('banshiryuu');
graph.addNode('Bluenugget64');
graph.addNode('cakophon');
graph.addNode('Collen');
graph.addNode('dowolf');
graph.addNode('DragonImps');
graph.addNode('FL81');
graph.addNode('Flamander');
graph.addNode('GameBopAdv');
graph.addNode('Haste_2');
graph.addNode('HBJDubs');
graph.addNode('Janus5k');
graph.addNode('JONALEON1');
graph.addNode('kaonashi1');
graph.addNode('KCF0107');
graph.addNode('loweffortmemes');
graph.addNode('Mac Arrowny');
graph.addNode('malyg');
graph.addNode('MC_XD');
graph.addNode('MoonRunes');
graph.addNode('MycroProcessor');
graph.addNode('NFUN');
graph.addNode('PIayer_0');
graph.addNode('Place');
graph.addNode('Prody Parrot');
graph.addNode('PSI_NESS');
graph.addNode('pyresword');
graph.addNode('Raetsel_Lapin');
graph.addNode('rwlh');
graph.addNode('Sceptilesolar');
graph.addNode('slykirby');
graph.addNode('Team Rocket Elite');
graph.addNode('tennisboy213');
graph.addNode('th3l3fty');
graph.addNode('TheArkOfTurus');
graph.addNode('UF8');
graph.addNode('xp1337');
graph.addNode('Xuxon');
graph.addNode('xx521xx');

graph.addLink('VGMC Results', 'Advokaiser', {strength: 0.66});
graph.addLink('VGMC Results', 'Akkrillic', {strength: 0.66});
graph.addLink('VGMC Results', 'Baconus_Yum', {strength: 0.59});
graph.addLink('VGMC Results', 'banshiryuu', {strength: 0.66});
graph.addLink('VGMC Results', 'Bluenugget64', {strength: 0.68});
graph.addLink('VGMC Results', 'cakophon', {strength: 0.64});
graph.addLink('VGMC Results', 'dowolf', {strength: 0.65});
graph.addLink('VGMC Results', 'DragonImps', {strength: 0.59});
graph.addLink('VGMC Results', 'FL81', {strength: 0.57});
graph.addLink('VGMC Results', 'Flamander', {strength: 0.6});
graph.addLink('VGMC Results', 'GameBopAdv', {strength: 0.6});
graph.addLink('VGMC Results', 'Haste_2', {strength: 0.6});
graph.addLink('VGMC Results', 'Janus5k', {strength: 0.6});
graph.addLink('VGMC Results', 'JONALEON1', {strength: 0.59});
graph.addLink('VGMC Results', 'kaonashi1', {strength: 0.59});
graph.addLink('VGMC Results', 'loweffortmemes', {strength: 0.67});
graph.addLink('VGMC Results', 'Mac Arrowny', {strength: 0.65});
graph.addLink('VGMC Results', 'MC_XD', {strength: 0.62});
graph.addLink('VGMC Results', 'MoonRunes', {strength: 0.63});
graph.addLink('VGMC Results', 'MycroProcessor', {strength: 0.6});
graph.addLink('VGMC Results', 'NFUN', {strength: 0.66});
graph.addLink('VGMC Results', 'PIayer_0', {strength: 0.58});
graph.addLink('VGMC Results', 'Place', {strength: 0.61});
graph.addLink('VGMC Results', 'Prody Parrot', {strength: 0.69});
graph.addLink('VGMC Results', 'Sceptilesolar', {strength: 0.7});
graph.addLink('VGMC Results', 'slykirby', {strength: 0.57});
graph.addLink('VGMC Results', 'Team Rocket Elite', {strength: 0.57});
graph.addLink('VGMC Results', 'th3l3fty', {strength: 0.65});
graph.addLink('VGMC Results', 'TheArkOfTurus', {strength: 0.66});
graph.addLink('VGMC Results', 'xp1337', {strength: 0.61});
graph.addLink('Akkrillic', 'Advokaiser', {strength: 0.583});
graph.addLink('azuarc', 'Advokaiser', {strength: 0.582});
graph.addLink('azuarc', 'Akkrillic', {strength: 0.572});
graph.addLink('Baconus_Yum', 'Akkrillic', {strength: 0.597});
graph.addLink('Baconus_Yum', 'azuarc', {strength: 0.682});
graph.addLink('banshiryuu', 'Akkrillic', {strength: 0.603});
graph.addLink('Bluenugget64', 'Advokaiser', {strength: 0.605});
graph.addLink('Bluenugget64', 'Akkrillic', {strength: 0.571});
graph.addLink('Bluenugget64', 'banshiryuu', {strength: 0.582});
graph.addLink('cakophon', 'banshiryuu', {strength: 0.678});
graph.addLink('cakophon', 'Bluenugget64', {strength: 0.694});
graph.addLink('Collen', 'Akkrillic', {strength: 0.636});
graph.addLink('Collen', 'banshiryuu', {strength: 0.602});
graph.addLink('Collen', 'cakophon', {strength: 0.602});
graph.addLink('DragonImps', 'Baconus_Yum', {strength: 0.58});
graph.addLink('FL81', 'Akkrillic', {strength: 0.589});
graph.addLink('FL81', 'Arti', {strength: 0.571});
graph.addLink('FL81', 'dowolf', {strength: 0.571});
graph.addLink('Flamander', 'Akkrillic', {strength: 0.622});
graph.addLink('Flamander', 'Baconus_Yum', {strength: 0.597});
graph.addLink('Flamander', 'banshiryuu', {strength: 0.633});
graph.addLink('Flamander', 'Bluenugget64', {strength: 0.661});
graph.addLink('Flamander', 'cakophon', {strength: 0.631});
graph.addLink('Flamander', 'Collen', {strength: 0.585});
graph.addLink('GameBopAdv', 'Akkrillic', {strength: 0.616});
graph.addLink('GameBopAdv', 'banshiryuu', {strength: 0.644});
graph.addLink('GameBopAdv', 'cakophon', {strength: 0.684});
graph.addLink('GameBopAdv', 'Collen', {strength: 0.686});
graph.addLink('GameBopAdv', 'Flamander', {strength: 0.606});
graph.addLink('Haste_2', 'Akkrillic', {strength: 0.604});
graph.addLink('Haste_2', 'banshiryuu', {strength: 0.592});
graph.addLink('Haste_2', 'Bluenugget64', {strength: 0.59});
graph.addLink('HBJDubs', 'azuarc', {strength: 0.582});
graph.addLink('Janus5k', 'Advokaiser', {strength: 0.696});
graph.addLink('Janus5k', 'Akkrillic', {strength: 0.576});
graph.addLink('Janus5k', 'banshiryuu', {strength: 0.613});
graph.addLink('Janus5k', 'FL81', {strength: 0.576});
graph.addLink('JONALEON1', 'banshiryuu', {strength: 0.581});
graph.addLink('JONALEON1', 'cakophon', {strength: 0.696});
graph.addLink('JONALEON1', 'Collen', {strength: 0.571});
graph.addLink('JONALEON1', 'dowolf', {strength: 0.586});
graph.addLink('JONALEON1', 'Flamander', {strength: 0.59});
graph.addLink('kaonashi1', 'Akkrillic', {strength: 0.571});
graph.addLink('kaonashi1', 'banshiryuu', {strength: 0.57});
graph.addLink('kaonashi1', 'cakophon', {strength: 0.641});
graph.addLink('kaonashi1', 'dowolf', {strength: 0.57});
graph.addLink('kaonashi1', 'Flamander', {strength: 0.59});
graph.addLink('kaonashi1', 'GameBopAdv', {strength: 0.624});
graph.addLink('kaonashi1', 'Haste_2', {strength: 0.609});
graph.addLink('kaonashi1', 'JONALEON1', {strength: 0.715});
graph.addLink('KCF0107', 'Collen', {strength: 0.571});
graph.addLink('KCF0107', 'GameBopAdv', {strength: 0.581});
graph.addLink('loweffortmemes', 'Advokaiser', {strength: 0.586});
graph.addLink('loweffortmemes', 'Bluenugget64', {strength: 0.65});
graph.addLink('loweffortmemes', 'cakophon', {strength: 0.591});
graph.addLink('loweffortmemes', 'dowolf', {strength: 0.613});
graph.addLink('loweffortmemes', 'Flamander', {strength: 0.574});
graph.addLink('loweffortmemes', 'Janus5k', {strength: 0.597});
graph.addLink('Mac Arrowny', 'Advokaiser', {strength: 0.681});
graph.addLink('Mac Arrowny', 'Baconus_Yum', {strength: 0.573});
graph.addLink('Mac Arrowny', 'banshiryuu', {strength: 0.586});
graph.addLink('Mac Arrowny', 'Bluenugget64', {strength: 0.576});
graph.addLink('Mac Arrowny', 'Haste_2', {strength: 0.571});
graph.addLink('Mac Arrowny', 'Janus5k', {strength: 0.691});
graph.addLink('Mac Arrowny', 'loweffortmemes', {strength: 0.613});
graph.addLink('malyg', 'HBJDubs', {strength: 0.573});
graph.addLink('malyg', 'KCF0107', {strength: 0.576});
graph.addLink('MC_XD', 'Advokaiser', {strength: 0.623});
graph.addLink('MC_XD', 'HBJDubs', {strength: 0.611});
graph.addLink('MC_XD', 'Janus5k', {strength: 0.602});
graph.addLink('MC_XD', 'loweffortmemes', {strength: 0.607});
graph.addLink('MC_XD', 'Mac Arrowny', {strength: 0.586});
graph.addLink('MC_XD', 'malyg', {strength: 0.598});
graph.addLink('MoonRunes', 'Akkrillic', {strength: 0.589});
graph.addLink('MoonRunes', 'banshiryuu', {strength: 0.633});
graph.addLink('MoonRunes', 'cakophon', {strength: 0.583});
graph.addLink('MoonRunes', 'Collen', {strength: 0.654});
graph.addLink('MoonRunes', 'Flamander', {strength: 0.649});
graph.addLink('MoonRunes', 'GameBopAdv', {strength: 0.596});
graph.addLink('MoonRunes', 'JONALEON1', {strength: 0.601});
graph.addLink('MoonRunes', 'kaonashi1', {strength: 0.607});
graph.addLink('MycroProcessor', 'Akkrillic', {strength: 0.57});
graph.addLink('MycroProcessor', 'banshiryuu', {strength: 0.607});
graph.addLink('MycroProcessor', 'cakophon', {strength: 0.69});
graph.addLink('MycroProcessor', 'Collen', {strength: 0.618});
graph.addLink('MycroProcessor', 'dowolf', {strength: 0.571});
graph.addLink('MycroProcessor', 'DragonImps', {strength: 0.571});
graph.addLink('MycroProcessor', 'Flamander', {strength: 0.644});
graph.addLink('MycroProcessor', 'GameBopAdv', {strength: 0.649});
graph.addLink('MycroProcessor', 'Haste_2', {strength: 0.603});
graph.addLink('MycroProcessor', 'JONALEON1', {strength: 0.733});
graph.addLink('MycroProcessor', 'kaonashi1', {strength: 0.833});
graph.addLink('MycroProcessor', 'MoonRunes', {strength: 0.644});
graph.addLink('NFUN', 'Akkrillic', {strength: 0.606});
graph.addLink('NFUN', 'azuarc', {strength: 0.589});
graph.addLink('NFUN', 'banshiryuu', {strength: 0.594});
graph.addLink('NFUN', 'cakophon', {strength: 0.582});
graph.addLink('NFUN', 'Collen', {strength: 0.576});
graph.addLink('NFUN', 'dowolf', {strength: 0.57});
graph.addLink('NFUN', 'FL81', {strength: 0.582});
graph.addLink('NFUN', 'Flamander', {strength: 0.58});
graph.addLink('PIayer_0', 'Akkrillic', {strength: 0.584});
graph.addLink('PIayer_0', 'dowolf', {strength: 0.577});
graph.addLink('PIayer_0', 'Haste_2', {strength: 0.593});
graph.addLink('PIayer_0', 'HBJDubs', {strength: 0.619});
graph.addLink('PIayer_0', 'malyg', {strength: 0.632});
graph.addLink('Place', 'Akkrillic', {strength: 0.575});
graph.addLink('Place', 'banshiryuu', {strength: 0.628});
graph.addLink('Place', 'Bluenugget64', {strength: 0.596});
graph.addLink('Place', 'cakophon', {strength: 0.764});
graph.addLink('Place', 'Collen', {strength: 0.65});
graph.addLink('Place', 'Flamander', {strength: 0.644});
graph.addLink('Place', 'GameBopAdv', {strength: 0.744});
graph.addLink('Place', 'JONALEON1', {strength: 0.617});
graph.addLink('Place', 'kaonashi1', {strength: 0.663});
graph.addLink('Place', 'MoonRunes', {strength: 0.684});
graph.addLink('Place', 'MycroProcessor', {strength: 0.733});
graph.addLink('Prody Parrot', 'Advokaiser', {strength: 0.661});
graph.addLink('Prody Parrot', 'Akkrillic', {strength: 0.644});
graph.addLink('Prody Parrot', 'banshiryuu', {strength: 0.746});
graph.addLink('Prody Parrot', 'Bluenugget64', {strength: 0.583});
graph.addLink('Prody Parrot', 'cakophon', {strength: 0.585});
graph.addLink('Prody Parrot', 'Collen', {strength: 0.571});
graph.addLink('Prody Parrot', 'GameBopAdv', {strength: 0.603});
graph.addLink('Prody Parrot', 'Haste_2', {strength: 0.615});
graph.addLink('Prody Parrot', 'Janus5k', {strength: 0.64});
graph.addLink('Prody Parrot', 'Mac Arrowny', {strength: 0.635});
graph.addLink('Prody Parrot', 'MoonRunes', {strength: 0.591});
graph.addLink('Prody Parrot', 'NFUN', {strength: 0.601});
graph.addLink('PSI_NESS', 'Collen', {strength: 0.628});
graph.addLink('PSI_NESS', 'GameBopAdv', {strength: 0.618});
graph.addLink('PSI_NESS', 'HBJDubs', {strength: 0.605});
graph.addLink('PSI_NESS', 'KCF0107', {strength: 0.639});
graph.addLink('pyresword', 'Arti', {strength: 0.593});
graph.addLink('rwlh', 'Baconus_Yum', {strength: 0.573});
graph.addLink('rwlh', 'DragonImps', {strength: 0.602});
graph.addLink('rwlh', 'Raetsel_Lapin', {strength: 0.571});
graph.addLink('Sceptilesolar', 'Advokaiser', {strength: 0.607});
graph.addLink('Sceptilesolar', 'Bluenugget64', {strength: 0.599});
graph.addLink('Sceptilesolar', 'dowolf', {strength: 0.623});
graph.addLink('Sceptilesolar', 'DragonImps', {strength: 0.592});
graph.addLink('Sceptilesolar', 'Janus5k', {strength: 0.649});
graph.addLink('Sceptilesolar', 'kaonashi1', {strength: 0.586});
graph.addLink('Sceptilesolar', 'loweffortmemes', {strength: 0.665});
graph.addLink('Sceptilesolar', 'Mac Arrowny', {strength: 0.592});
graph.addLink('Sceptilesolar', 'malyg', {strength: 0.614});
graph.addLink('Sceptilesolar', 'MC_XD', {strength: 0.628});
graph.addLink('Sceptilesolar', 'pyresword', {strength: 0.589});
graph.addLink('slykirby', 'Janus5k', {strength: 0.577});
graph.addLink('slykirby', 'Mac Arrowny', {strength: 0.583});
graph.addLink('slykirby', 'malyg', {strength: 0.579});
graph.addLink('slykirby', 'MC_XD', {strength: 0.583});
graph.addLink('Team Rocket Elite', 'Advokaiser', {strength: 0.582});
graph.addLink('Team Rocket Elite', 'Haste_2', {strength: 0.583});
graph.addLink('Team Rocket Elite', 'Janus5k', {strength: 0.577});
graph.addLink('Team Rocket Elite', 'loweffortmemes', {strength: 0.582});
graph.addLink('Team Rocket Elite', 'MC_XD', {strength: 0.571});
graph.addLink('Team Rocket Elite', 'PIayer_0', {strength: 0.641});
graph.addLink('Team Rocket Elite', 'Sceptilesolar', {strength: 0.632});
graph.addLink('Team Rocket Elite', 'slykirby', {strength: 0.599});
graph.addLink('tennisboy213', 'azuarc', {strength: 0.609});
graph.addLink('tennisboy213', 'HBJDubs', {strength: 0.573});
graph.addLink('tennisboy213', 'PIayer_0', {strength: 0.593});
graph.addLink('tennisboy213', 'pyresword', {strength: 0.589});
graph.addLink('th3l3fty', 'Advokaiser', {strength: 0.592});
graph.addLink('th3l3fty', 'Akkrillic', {strength: 0.596});
graph.addLink('th3l3fty', 'banshiryuu', {strength: 0.602});
graph.addLink('th3l3fty', 'GameBopAdv', {strength: 0.581});
graph.addLink('th3l3fty', 'Haste_2', {strength: 0.587});
graph.addLink('th3l3fty', 'loweffortmemes', {strength: 0.586});
graph.addLink('th3l3fty', 'Mac Arrowny', {strength: 0.576});
graph.addLink('th3l3fty', 'MoonRunes', {strength: 0.58});
graph.addLink('th3l3fty', 'NFUN', {strength: 0.618});
graph.addLink('th3l3fty', 'Prody Parrot', {strength: 0.598});
graph.addLink('th3l3fty', 'Team Rocket Elite', {strength: 0.582});
graph.addLink('TheArkOfTurus', 'Arti', {strength: 0.612});
graph.addLink('TheArkOfTurus', 'azuarc', {strength: 0.582});
graph.addLink('TheArkOfTurus', 'Baconus_Yum', {strength: 0.599});
graph.addLink('TheArkOfTurus', 'dowolf', {strength: 0.581});
graph.addLink('TheArkOfTurus', 'DragonImps', {strength: 0.581});
graph.addLink('TheArkOfTurus', 'FL81', {strength: 0.613});
graph.addLink('TheArkOfTurus', 'Janus5k', {strength: 0.576});
graph.addLink('TheArkOfTurus', 'loweffortmemes', {strength: 0.592});
graph.addLink('TheArkOfTurus', 'Mac Arrowny', {strength: 0.613});
graph.addLink('TheArkOfTurus', 'NFUN', {strength: 0.57});
graph.addLink('TheArkOfTurus', 'pyresword', {strength: 0.589});
graph.addLink('TheArkOfTurus', 'Sceptilesolar', {strength: 0.592});
graph.addLink('UF8', 'cakophon', {strength: 0.596});
graph.addLink('UF8', 'DragonImps', {strength: 0.62});
graph.addLink('UF8', 'Flamander', {strength: 0.601});
graph.addLink('UF8', 'JONALEON1', {strength: 0.637});
graph.addLink('UF8', 'kaonashi1', {strength: 0.608});
graph.addLink('UF8', 'loweffortmemes', {strength: 0.596});
graph.addLink('UF8', 'MycroProcessor', {strength: 0.643});
graph.addLink('xp1337', 'Advokaiser', {strength: 0.654});
graph.addLink('xp1337', 'Akkrillic', {strength: 0.583});
graph.addLink('xp1337', 'Janus5k', {strength: 0.623});
graph.addLink('xp1337', 'loweffortmemes', {strength: 0.66});
graph.addLink('xp1337', 'Mac Arrowny', {strength: 0.586});
graph.addLink('xp1337', 'Sceptilesolar', {strength: 0.681});
graph.addLink('Xuxon', 'Arti', {strength: 0.57});
graph.addLink('Xuxon', 'Collen', {strength: 0.594});
graph.addLink('Xuxon', 'KCF0107', {strength: 0.606});
graph.addLink('Xuxon', 'PSI_NESS', {strength: 0.631});
graph.addLink('Xuxon', 'pyresword', {strength: 0.597});
graph.addLink('xx521xx', 'Advokaiser', {strength: 0.639});
graph.addLink('xx521xx', 'azuarc', {strength: 0.592});
graph.addLink('xx521xx', 'HBJDubs', {strength: 0.573});
graph.addLink('xx521xx', 'MC_XD', {strength: 0.597});
graph.addLink('xx521xx', 'PIayer_0', {strength: 0.571});
graph.addLink('xx521xx', 'Sceptilesolar', {strength: 0.571});
graph.addLink('xx521xx', 'Team Rocket Elite', {strength: 0.632});
graph.addLink('xx521xx', 'th3l3fty', {strength: 0.586});

var LO=0.57
var HI=0.833



graph.getNode('VGMC Results').isPinned = true;

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
    gravity : -10 ,
    springTransform: function (link, spring) {
      spring.length = 1000 * (1 - (link.data.strength-LO)/(HI-LO));
    }
});

// Render the graph
var renderer = Viva.Graph.View.renderer(graph, {
      layout : layout,
      graphics : graphics
    });

renderer.run();