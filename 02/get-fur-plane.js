const gl = require('glslify');
const getPlane = require('primitive-plane');
const mat4 = require('gl-mat4');
const rotateTranslateToMatrix = require('./rotate-translate-to-matrix');

const size = 60;
const plane = getPlane(size, size, 40, 40);

module.exports = (regl) => {
  return regl({
    frag: gl(`
      precision mediump float;

      #pragma glslify: getNoise = require(glsl-noise/simplex/2d)

      uniform vec3 furColor1;
      uniform vec3 furColor2;
      uniform float time;
      uniform float timeOffset;

      varying vec2 vUV;
      varying vec3 vNormal;

      void main() {
        vec2 vNoise = vec2(vUV.x * 20.0, vUV.x * 10.0);
        vec2 vNoiseLight = vec2(vUV.x * 10.0, vUV.x * 10.0);
        float noise = getNoise(vNoise) * 0.2 + 0.8;
        float noiseLight = getNoise(vNoiseLight) * 0.2 + 0.8;

        float darkness = (vUV.y * 0.9 + 0.1);

        float t = 1.0 - mod(time * 0.3 + timeOffset, 1.0) + noise * 0.05;
        float lineLight = step(vUV.y, t + 0.11) * step(t + 0.1, vUV.y) * (vUV.y * 0.8 + 0.2);
        float pulseLight = smoothstep(0.5, 0.9, vUV.y) * cos(time * 0.5);

        darkness += lineLight;
        darkness += pulseLight;

        gl_FragColor = vec4((furColor1 * noise + furColor2 * (1.0 - noise)) * darkness, 1.0);
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
        // offset base
        position.x += (getNoise(vUV) * 10.0 - 20.0) * vUV.y;
        position.z += (getNoise(vUV) * 20.0 - 20.0) * vUV.y;

        float effectBase = (1.0 - vUV.y);
        float effectTip = (1.0 - vUV.y);

        // offset tip
        position.x += (getNoise(vUV * (cos(time + timeOffset)) + 1.0 * 0.5) * 40.0) * effectBase;
        position.z += (getNoise(vUV * (cos(time + timeOffset)) + 1.0 * 0.5) * 40.0) * effectTip;

        position.x *= vUV.y;
        position.z *= vUV.y;
 
        vec4 positionModel = model * vec4(position, 1);

        positionModel.y += (cos(time + timeOffset) + 1.0) * 0.5 * 10.0 * sin(effectTip * 3.145);

        gl_Position = projection * view * positionModel;
      }
    `),
    uniforms: {
      projection: regl.prop('projection'),
      view: regl.prop('view'),
      furColor1: regl.prop('furColor1'),
      furColor2: regl.prop('furColor2'),
      time: regl.prop('time'),
      timeOffset: regl.prop('timeOffset'),
      model: (context, {rotate, translate, scale, radius, modelParent}) => {
        const model = mat4.create();

        
        mat4.multiply(model, model, modelParent);
        
        
        mat4.rotateY(model, model, rotate[1]);
        mat4.rotateX(model, model, rotate[0]);

        mat4.translate(model, model, [0, radius, 0]);
        mat4.scale(model, model, scale);
        mat4.translate(model, model, [0, size * 0.5, 0]);


        // 0,
        // 1,
        // zero,
        // one,
        // src color,
        // one minus src color,
        // src alpha,
        // one minus src alpha,
        // dst color,
        // one minus dst color,
        // dst alpha,
        // one minus dst alpha,
        // constant color,
        // one minus constant color,
        // constant alpha,
        // one minus constant alpha,
        // src alpha saturate
        // Rresult = Rs * Sr + Rd * Dr
        
        // Rd == dist red
        // Rs == source red
        // Sr == source factor
        // Dr == dest factor

        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        // Rresult = Rs * As + Rd

        return model;
      }
    },
    depth: {
      enable: true
    },
    // blend: {
    //   enable: true,
    //   equation: 'add',
    //   func: {src:'src alpha',dst:'one minus src alpha'},
    //   // color: [0, 0, 0, 1]
    // },
    cull: {
      enable: false
    },
    attributes: plane,
    elements: plane.cells,
    count: plane.cells.length * 3
  });
};