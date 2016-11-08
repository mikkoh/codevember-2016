const mat4 = require('gl-mat4');
const getPost1 = require('./get-post1');
const getPost2 = require('./get-post2');
const getLightDrawing = require('./get-light-drawing');
const geoPieceRingStack = require('./geo-piece-ring-stack');
const geoTopPieceRings = require('./geo-top-piece-rings');
const geoChevronList = require('./geo-chevron-list');

module.exports = (regl) => {
  const drawPost1 = getPost1(regl);
  const drawPost2 = getPost2(regl);
  const drawPieceRings = getLightDrawing(regl, geoPieceRingStack);
  const drawPieceRingsTop = getLightDrawing(regl, geoTopPieceRings);
  const drawChevrons = getLightDrawing(regl, geoChevronList);

  return ({time}, props) => {
    const parent = mat4.create();
    const modelSides = mat4.create();
    const modelMiddle = mat4.create();

    // update parent
    mat4.rotateY(parent, parent, time);

    mat4.rotateX(modelSides, modelSides, Math.PI * 0.5);
    mat4.translate(modelSides, modelSides, [-10, -10, 0]);
    drawPost1({
      parent,
      model: modelSides
    });

    mat4.translate(modelSides, modelSides, [20, 0, 0]);
    drawPost1({
      parent,
      model: modelSides
    });

    mat4.translate(modelSides, modelSides, [0, 20, 0]);
    drawPost1({
      parent,
      model: modelSides
    });

    mat4.translate(modelSides, modelSides, [-20, 0, 0]);
    drawPost1({
      parent,
      model: modelSides
    });


    // draw the middle post
    mat4.translate(modelMiddle, modelMiddle, [0, -25, 0]);

    drawPost2({
      parent,
      model: modelMiddle
    });

    drawPieceRings({
      parent,
      model: modelMiddle
    });

    mat4.translate(modelMiddle, modelMiddle, [0, 11, 0]);

    drawPost2({
      parent,
      model: modelMiddle
    });

    mat4.translate(modelMiddle, modelMiddle, [0, -5, 0]);
    drawPieceRings({
      parent,
      model: modelMiddle
    });

    mat4.translate(modelMiddle, modelMiddle, [0, 10.5 + (Math.sin(time) + 1) * 0.5 * 3, 0]);
    mat4.rotateY(modelMiddle, modelMiddle, time);
    mat4.rotateZ(modelMiddle, modelMiddle, Math.PI * 0.5);
    drawChevrons({
      parent,
      model: modelMiddle
    });


    drawPieceRingsTop({
      parent,
      model: mat4.create()
    });
  };
};
