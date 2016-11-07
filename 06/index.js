const getRegl = require('regl');
const touches = require('touches');
const getSetupScene = require('./get-setup-scene');
const getPole = require('./get-pole');
const getGround = require('./get-ground');
const getSky = require('./get-sky');

const regl = getRegl();
const drawPole = getPole(regl);
const drawGround = getGround(regl);
const drawSky = getSky(regl);

const setupScene = getSetupScene(regl);

const countPoles = 100;
const distBetweenPoles = 40;
const poleStartZ = countPoles * -distBetweenPoles;
const poles = Array.apply(null, Array(100)).map((v, i) => {
  return {
    translate: [20, 0, i * 40 + poleStartZ]
  };
});

const mouse = [0, 0];

const mouseHandler = touches().on('move', (ev, position) => {
  let [x, y] = position;
  mouse[0] = x / window.innerWidth * 2 - 1;
  mouse[1] = y / window.innerHeight * 2 - 1;
});


regl.frame(() => {
  setupScene({ mouse }, () => {
    regl.clear({
      color: [0.3, 0.3, 0.3, 1],
      depth: 1
    });

    drawGround({
      translate: [0, -10, -100]
    });

    drawPole(poles);

    drawSky();
  });
});
