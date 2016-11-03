const regl = require('regl')();
const getSetupScene = require('./get-setup-scene');
const getFurBall = require('./get-fur-ball');

const setupScene = getSetupScene(regl);
const drawFurBall = getFurBall(regl);

regl.frame(() => {
  setupScene(({time, projection, view}) => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1
    });

    drawFurBall({
      time,
      projection, 
      view,
      rotate: [0, time * 0.5, 0],
      translate: [0, 0, -200]
    });
  });
});
