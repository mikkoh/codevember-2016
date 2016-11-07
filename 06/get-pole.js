const getPlane = require('primitive-plane');
const primitiveJoin = require('./primitive-join');
const mat4 = require('gl-mat4');
const vec3 = require('gl-vec3');

function transformPositions(geometry, mat) {
  geometry.positions.map((vertex) => {
    vec3.transformMat4(vertex, vertex, mat);
  });
}

function getHorizonalPiece(y = 12.5) {
  const horizontal = getPlane(10, 1);

  const mat = mat4.create();
  mat4.translate(mat, mat, [0, y, 0]);

  transformPositions(horizontal, mat);  

  return horizontal;
}

function getWire(offSet = 3.4) {
  const wire = getPlane(0.3, 40);

  const mat = mat4.create();

  mat4.translate(mat, mat, [offSet, 12.5, 20]);  
  mat4.rotateX(mat, mat, Math.PI * 0.5);

  transformPositions(wire, mat);  

  return wire;
}

const attributes = {};
const vertical = getPlane(1, 30);

primitiveJoin(attributes, vertical);
primitiveJoin(attributes, getHorizonalPiece(12.5));
primitiveJoin(attributes, getHorizonalPiece(9.5));
primitiveJoin(attributes, getWire(3.4));
primitiveJoin(attributes, getWire(-3.4));

module.exports = function(regl) {
  return regl({
    frag: `
      precision mediump float;

      void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }
    `,
    vert: `
      attribute vec3 positions;

      uniform mat4 projection;
      uniform mat4 view;
      uniform mat4 model;

      void main() {
        gl_Position = projection * view * model * vec4(positions, 1);
      }
    `,
    uniforms: {
      model: (context, {translate = [0, 0, 0]}) => {
        const model = mat4.create();

        mat4.translate(model, model, translate);

        return model;
      }
    },
    attributes: attributes,
    elements: attributes.cells,
    count: attributes.cells.length * 3
  });
};
