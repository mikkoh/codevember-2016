const gl = require('glslify');
const getSphere = require('primitive-sphere');
const mat4 = require('gl-mat4');

const sphere = getSphere(1000);

module.exports = function(regl) {
  return regl({
    frag: gl(`
      precision mediump float;

      #pragma glslify: getNoise = require(glsl-noise/simplex/2d)

      uniform float time;

      varying vec2 vUV;

      void main() {
        vec3 colorBlue = vec3(0.4, 0.4, 0.9);
        vec3 colorOrange = vec3(1.0, 0.7, 0.2) * 0.4;
        vec3 color = vec3(0.0);

        // spin sky
        vec2 uv = vUV + vec2(time, cos(time * 0.5)) * 0.005;

        // lightning
        float t = getNoise(vec2(time * 2.0, 0));
        float lightning = smoothstep(0.5, 0.7, t);
        colorOrange *= lightning + 0.5;

        float blueAmount = smoothstep(0.8, 0.4, uv.y);
        float blackAmount = smoothstep(0.5, 0.2, uv.y);

        colorBlue *= blueAmount;
        colorOrange *= 1.0 - blueAmount;

        color += colorBlue * blackAmount;
        color += colorOrange;

        // make the sky slightly uneven
        color *= getNoise(uv * 10.0) * 0.3 + 1.0;

        // stars
        vec2 starUV = mod(uv, vec2(0.02)) / 0.02;
        float colorStar = step(length(starUV - vec2(0.1)), 0.01);
        colorStar += step(length(starUV - vec2(0.8, 0.3)), 0.01);
        colorStar += step(length(starUV - vec2(0.5, 0.5)), 0.005);
        colorStar = min(colorStar, 1.0);
        colorStar *= getNoise(uv * 10.0) * 0.3 + 0.2;
        colorStar *= smoothstep(0.5, 0.4, uv.y);

        color += colorStar * vec3(1.0, 1.0, 1.0);

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
      model: (context, props) => {
        const model = mat4.create();

        return model;
      }
    },
    attributes: sphere,
    elements: sphere.cells,
    count: sphere.cells.length * 3,
    cull: {
      enable: true,
      face: 'front'
    }
  });
};
