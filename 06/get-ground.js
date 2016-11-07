const gl = require('glslify');
const getPlane = require('primitive-plane');
const mat4 = require('gl-mat4');

const plane = getPlane(1000, 10000, 1, 1);

module.exports = function(regl) {
  return regl({
    frag: gl(`
      precision mediump float;

      #define PI 3.141592653589793
      #define TWO_PI 6.28318530717959
      #pragma glslify: getNoise = require(glsl-noise/simplex/2d)

      uniform float time;

      varying vec2 vUV;

      void main() {
        vec3 color = vec3(0.045, 0.0, 0.015);

        float road = step(0.51, vUV.x) + step(vUV.x, 0.45);

        float t = getNoise(vec2(time * 2.0, 0));
        float lightning = smoothstep(0.5, 0.7, t);

        float roadDashesLine = 1.0 - (step(0.48 + 0.0015, vUV.x) + step(vUV.x, 0.48 - 0.0015));
        roadDashesLine *= ceil(cos(vUV.y * TWO_PI * 100.0));

        // texture dashes
        roadDashesLine *= getNoise(vUV * 90000.0) * 0.3 + 0.7;

        float lastDashes = (1.0 - smoothstep(0.49, 0.52, vUV.y));

        road += roadDashesLine;

        color *= road;
        color += vec3(roadDashesLine * 0.7);
        color *= vec3(0.8, 0.8, 1.0);

        color += lastDashes * vec3(0.1, 0.07, 0.02) * lightning * 0.5;

        color *= getNoise(vUV * 10.0) * 0.3 + 1.0;

        gl_FragColor = vec4(color, 1.0);
      }
    `),
    vert: `
      attribute vec3 positions;
      attribute vec2 uvs;

      uniform mat4 projection;
      uniform mat4 view;
      uniform mat4 model;

      varying vec2 vUV;

      void main() {
        gl_Position = projection * view * model * vec4(positions, 1);
        vUV = uvs;
      }
    `,
    uniforms: {
      time: regl.context('time'),
      model: (context, {translate = [0, 0, 0]}) => {
        const model = mat4.create();

        mat4.translate(model, model, translate);
        mat4.rotateX(model, model, Math.PI * -0.5);

        return model;
      }
    },
    attributes: plane,
    elements: plane.cells,
    count: plane.cells.length * 3
  });
};
