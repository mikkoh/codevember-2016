const createPlane = require('primitive-plane');
const mat4 = require('gl-mat4');
const gl = require('glslify');

const planeSize = 4;
const plane = createPlane(planeSize, planeSize, 40, 40);

module.exports = (regl) => {
  return regl({
    frag: gl(`
      precision mediump float;

      #pragma glslify: getNoise = require(glsl-noise/simplex/2d)
      #pragma glslify: blinnPhongSpec = require(glsl-specular-blinn-phong) 

      uniform vec3 lightColor;
      uniform vec3 groundLightColor;
      uniform float time;
      uniform float timeOffset;
      uniform float distanceToObject; // should be a value between 1 and 0

      varying vec2 vUV;
      varying vec3 vNormal;

      void main() {
        float lightIntensity = (1.0 - distanceToObject);
        float dist = length(vUV - vec2(0.5));
        float circle = 1.0 - smoothstep(0.2, 0.5, dist);
        float circleInner = 1.0 - smoothstep(0.2, 0.3, dist);
        float circleInnerInner = 1.0 - smoothstep(0.0, 0.3, dist);

        float lightIntensityInner = smoothstep(0.3, 1.0, lightIntensity) * 1.5;

        float noise = 0.0;
        noise += getNoise(vUV * 10.0) * 0.1 + 0.9; // big noise
        noise += getNoise(vUV * 100.0) * 0.2 + 0.8; // lil noise

        vec3 color = groundLightColor * noise;

        vec3 colorInner = color * lightIntensityInner * circleInner;
        vec3 colorInnerInner = vec3(0.0, 0.0, 0.4) * lightIntensityInner * 2.0 * circleInnerInner;
        vec3 colorOuter = color * lightIntensity * circle;

        float power = 0.0; // blinnPhongSpec(vec3(1, 1, 1), vec3(0, 0, 1), vNormal, 10.0);

        color = colorOuter + colorInner + colorInnerInner;
        color += lightColor * power * 2.0;

        gl_FragColor = vec4(color, 1);
      }
    `),
    vert: gl(`
      precision mediump float;

      #pragma glslify: getNoise = require(glsl-noise/simplex/2d)

      uniform mat4 projection;
      uniform mat4 view;
      uniform mat4 model;
      uniform float time;
      uniform float timeOffset;
      uniform float scale;

      attribute vec3 positions;
      attribute vec2 uvs;
      attribute vec3 normals;

      varying vec2 vUV;
      varying vec3 vNormal;

      void main() {
        vUV = uvs;
        vNormal = normals;

        float noise = getNoise(vUV * 10.0);

        vec3 position = positions;
        position.y += 1.0 * noise * 1.0 / scale;

        gl_Position = projection * view * model * vec4(position, 1);
      }
    `),
    uniforms: {
      lightColor: regl.prop('lightColor'),
      groundLightColor: regl.prop('groundLightColor'),
      scale: regl.prop('scale'),
      model: (context, {scale = 1, position = [0, 0]}) => {
        const model = mat4.create();

        mat4.translate(model, model, [position[0], -40, position[1]]);

        mat4.scale(model, model, [scale, scale, scale]);
        mat4.rotateX(model, model, Math.PI * -0.5);

        return model;
      },
      distanceToObject: regl.prop('distanceToObject')
    },
    attributes: plane,
    elements: plane.cells,
    count: plane.cells.length * 3,
    depth: {
      enable: false
    },
    blend: {
      enable: true,
      func: { src:'src alpha', dst:'one' }
    }
  });
};