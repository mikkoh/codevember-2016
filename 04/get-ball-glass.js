const createSphere = require('primitive-sphere');
const mat4 = require('gl-mat4');
const gl = require('glslify');
const vec3 = require('gl-vec3');

const radius = 1;
const sphere = createSphere(radius);

module.exports = (regl, isInner) => {
  const attributes = Object.assign(
    sphere,
    {
      normals: sphere.normals.map((normal) => {
        return normal.map(v => -v);
      })
    }
  );

  return regl({
    frag: gl(`
      precision mediump float;

      #pragma glslify: random = require(glsl-random) 
      #pragma glslify: blinnPhongSpec = require(glsl-specular-blinn-phong) 

      uniform vec3 color;
      uniform vec3 lightColor;
      uniform float time;
      uniform float timeOffset;
      uniform float lightIntensity;

      varying vec2 vUV;
      varying vec3 vNormal;

      void main() {
        vec3 outColor = color;
        float power = blinnPhongSpec(vec3(cos(time), 0.5, sin(time)), vec3(0, 0, 1), vNormal, 10.0);

        outColor += lightColor * power * lightIntensity;
        outColor *= power * 0.2 + 0.8;

        outColor *= random(vUV) * 0.2 + 0.8;

        gl_FragColor = vec4(outColor, 1.0);
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

      attribute vec3 positions;
      attribute vec2 uvs;
      attribute vec3 normals;

      varying vec2 vUV;
      varying vec3 vNormal;

      void main() {
        vUV = uvs;
        vNormal = normals;

        vec3 position = positions;

        gl_Position = projection * view * model * vec4(position, 1);
      }
    `),
    uniforms: {
      time: ({time}) => {
        return time;
      },
      color: (context, {color = [1, 1, 1]}) => {
        return color;
      },
      lightIntensity: (context, {lightIntensity = 10}) => {
        return lightIntensity;
      },
      lightColor: (context, {lightColor = [0.1, 0.1, 0.1]}) => {
        return lightColor;
      },
      model: (context, {position = [0, 0, 0], radius = 1}) => {
        const model = mat4.create();
        
        mat4.translate(model, model, position);

        mat4.scale(model, model, [radius, radius, radius]);

        return model;
      }
    },
    attributes: sphere,
    elements: sphere.cells,
    count: sphere.cells.length * 3,
    depth: {
      enable: false
    },
    blend: {
      enable: true,
      func: { src:'src alpha', dst:'one' }
    },
    cull: {
      enable: true,
      face: isInner ? 'front' :'back'
    }
  });
};