const regl = require('regl')();
const getSetupScene = require('./get-setup-scene');
const getBuilding = require('./get-building');

const setupScene = getSetupScene(regl);
const drawBuilding = getBuilding(regl);

regl.frame(() => {
  setupScene((context, props) => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1
    });

    drawBuilding(context, props);
  });
});
