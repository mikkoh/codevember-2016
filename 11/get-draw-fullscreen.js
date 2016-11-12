const getPlane = require('primitive-plane');

const plane = getPlane(2, 2, 0, 0);

module.exports = (regl, opts) => {
  const drawOpts = Object.assign(
    {
      frag: `
        precision mediump float;

        uniform sampler2D texture;

        varying vec2 vUV;

        void main() {
          gl_FragColor = texture2D(texture, vUV);
        }
      `,
      vert: `
      attribute vec3 positions;
      attribute vec2 uvs;

      varying vec2 vUV;

      void main() {
        vUV = uvs;
        gl_Position = vec4(positions, 1);
      }`,
      attributes: plane,
      elements: plane.cells,
      count: plane.cells.length * 3,
      uniforms: {
        texture: regl.prop('texture')
      }
    },
    opts
  );

  return regl(drawOpts);
};
