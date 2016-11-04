const createSphere = require('primitive-sphere');
const mat4 = require('gl-mat4');
const gl = require('glslify');

const radius = 1;
const sphere = createSphere(radius);

module.exports = (regl) => {
  return regl({
    frag: gl(`
      precision mediump float;

      #pragma glslify: getNoise = require(glsl-noise/simplex/2d)
      #pragma glslify: blinnPhongSpec = require(glsl-specular-blinn-phong) 

      uniform vec3 color;
      uniform vec3 lightColor;
      uniform vec3 groundLightColor;
      uniform float time;
      uniform float timeOffset;
      uniform float distanceToObject; // should be a value between 1 and 0

      varying vec2 vUV;
      varying vec3 vNormal;

      void main() {
        vec3 outColor = color;
        float groundIntensity = (1.0 - distanceToObject);
        float power = blinnPhongSpec(vec3(1, 1, 1), vec3(0, 0, 1), vNormal, 10.0);

        float noise = 0.0;
        noise += getNoise(vUV * 10.0) * 0.1 + 0.9; // big noise
        noise += getNoise(vUV * 100.0) * 0.2 + 0.8; // lil noise

        outColor += lightColor * power * 10.0;
        outColor *= power * 0.2 + 0.8;

        outColor += groundLightColor * max(smoothstep(0.5, 1.0, vUV.y) * groundIntensity * (noise * 0.7 + 0.3), 0.0);

        gl_FragColor = vec4(outColor, 1);
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
      uniform float distanceToObject;
      uniform float scale;

      attribute vec3 positions;
      attribute vec2 uvs;
      attribute vec3 normals;

      varying vec2 vUV;
      varying vec3 vNormal;

      void main() {
        vUV = uvs;
        vNormal = normals;

        vec3 position = positions;

        position.y += distanceToObject * 10.0 * 1.0 / scale;

        gl_Position = projection * view * model * vec4(position, 1);
      }
    `),
    uniforms: {
      color: regl.prop('color'),
      lightColor: regl.prop('lightColor'),
      groundLightColor: regl.prop('groundLightColor'),
      scale: regl.prop('scale'),
      model: (context, {scale = 1, position = [0, 0]}) => {
        const model = mat4.create();
        
        mat4.translate(model, model, [position[0], -40, position[1]]);

        mat4.scale(model, model, [scale, scale, scale]);

        // translate so its above the ground
        mat4.translate(model, model, [0, radius, 0]);

        return model;
      },
      distanceToObject: regl.prop('distanceToObject')
    },
    attributes: sphere,
    elements: sphere.cells,
    count: sphere.cells.length * 3
  });
};