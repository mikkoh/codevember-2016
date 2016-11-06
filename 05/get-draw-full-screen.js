const createPlane = require('primitive-plane');

const plane = createPlane(2, 2);

module.exports = (regl, opts) => {
  return regl(
    Object.assign(
      {
        vert: `
          attribute vec3 positions;
          attribute vec2 uvs;

          varying vec2 vUV;

          void main() {
            vUV = uvs;
            gl_Position = vec4(positions, 1);
          }
        `,
        attributes: plane,
        elements: plane.cells,
        count: plane.cells.length * 3
      },
      opts
    )
  );
};