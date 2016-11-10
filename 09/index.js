const regl = require('regl')();
const mat4 = require('gl-mat4');
const getSetupScene = require('./get-setup-scene');
const getFishBody = require('./get-fish-body');
const geoFishBody = require('./geo-fish-body');

const setupScene = getSetupScene(regl);
const drawFish = getFishBody(regl, geoFishBody);

const colors = [
  [[0.010, 0.643, 0.884], [0.951, 0.243, 0.211]],
  [[0.682, 0.431, 0.813], [0.931, 0.714, 0.154]],
  [[0.098, 0.538, 0.540], [0.949, 0.949, 0.949]],
  [[0.949, 0.949, 0.949], [0.682, 0.431, 0.813]]
];

const state = Array.apply(null, Array(1500)).map(() => {
  const maxDist = 5000;
  const minDist = 40;
  const maxOffY = 500;
  const minOffY = -500;
  const distFromCenter = Math.random() * (maxDist - minDist) + minDist;
  const rotateOffset = Math.random() * Math.PI * 2;
  const rotateSpeed = (1 - (distFromCenter - minDist) / (maxDist - minDist)) * 0.06 + 0.02;
  const translate = [0, Math.random() * (maxOffY - minOffY) + minOffY, distFromCenter];
  const scale = [0.5, 0.5, 0.5];
  const [bodyColor, finColor] = colors[Math.round((colors.length - 1) * Math.random())];


  return {
    rotateSpeed,
    translate,
    scale,
    rotateOffset,
    bodyColor,
    finColor
  };
});

regl.frame(() => {
  setupScene((context, props) => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1
    });

    state.forEach(({rotateSpeed, rotateOffset, translate, scale, bodyColor, finColor}) => {
      const model = mat4.create();
      
      mat4.rotateY(model, model, context.time * -rotateSpeed + rotateOffset);
      mat4.translate(model, model, translate);
      mat4.scale(model, model, scale);
      
      drawFish({
        model,
        timeOffset: 0.3,
        bodyColor,
        finColor
      });
    });
  });
});
