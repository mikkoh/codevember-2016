const getFurPlane = require('./get-fur-plane');
const mat4 = require('gl-mat4');
const vec3 = require('gl-vec3');
const quat = require('gl-quat');

const rotateTranslateToMatrix = require('./rotate-translate-to-matrix');

const randColor = [Math.random(), Math.random(), Math.random];

module.exports = (regl) => {
  const drawFurPlane = getFurPlane(regl);
  const countFur = 200;
  const furOptions = Array.apply(undefined, Array(countFur)).map((v, i) => {
    let furColor1;
    let furColor2;

    furColor1 = randColor; //[Math.random() * 0.5 + 0.5, 0, 0];
    furColor2 = [0.3, 0, 0.5];

    return {
      furColor1,
      furColor2,
      timeOffset: Math.random() * 0.5,
      radius: 20,
      translate: [0, 0, 0],
      rotate: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0],
      scale: [Math.random() * 0.5 + 0.2, Math.random() * 0.1 + 1, Math.random() * 0.5 + 0.2]
    };
  });

  return ({time, projection, view, rotate, translate}) => {
    rotate = rotate || [0, 0, 0];
    translate = translate || [0, 0, 0];

    const modelParent = mat4.create();

    mat4.translate(modelParent, modelParent, translate);
    mat4.rotateX(modelParent, modelParent, rotate[0]);
    mat4.rotateY(modelParent, modelParent, rotate[1]);
    mat4.rotateZ(modelParent, modelParent, rotate[2]);
    
    const drawOptions = furOptions.map((furOption) => {
      return Object.assign(
        {projection, view, modelParent, time},
        furOption
      );
    });

    drawFurPlane(drawOptions);
  };
};