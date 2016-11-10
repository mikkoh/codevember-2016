const gl = require('glslify');

module.exports = (regl, attributes) => {
  return regl({
    frag: `
      precision mediump float;

      varying vec2 vUV;
      varying float vIsBody;

      uniform vec3 bodyColor;
      uniform vec3 finColor;

      void main() {
        vec3 color = vIsBody > 0.5 ? bodyColor : finColor;
        float maxAlpha = 1.0;
        float minAlpha = 0.13;
        float alpha = step(vUV.x, 0.1) + step(0.9, vUV.x) +
                      step(vUV.y, 0.1) + step(0.9, vUV.y);
        alpha = alpha * (maxAlpha - minAlpha) + minAlpha;


        gl_FragColor = vec4(color, alpha);
      }
    `,
    vert: gl(`
      #define PI 3.141592653589793

      #pragma glslify: shapeIn = require(glsl-easings/quartic-in)
      #pragma glslify: shapeOut = require(glsl-easings/exponential-out)

      attribute vec3 positions;
      attribute vec2 uvs;
      attribute float isBody;

      uniform mat4 view;
      uniform mat4 projection;
      uniform mat4 model;
      uniform float time;
      uniform float timeOffset;

      varying vec2 vUV;
      varying float vIsBody;

      void main() {
        float bodyLength = 40.0;
        float bodyHeight = 5.0;
        float bodyDepth = 5.0;
        float heightOffset = 5.0;
        float depthOffset = 2.0;
        float maxDepth = 2.0;
        float wiggleAmount = 3.0;
        vec3 position = positions;
        vec3 body = vec3(position.x / bodyLength, position.y / bodyHeight, position.z / bodyDepth) + vec3(0.5);

        // this will make the fish fatter at the start
        float shape = shapeOut(body.x) * 2.0 - body.x * 2.4;

        // this will make the fish the fish shape
        position.y += shape * (body.y * 2.0 - 1.0) * heightOffset;
        position.z += shape * (body.z * 2.0 - 1.0) * depthOffset;

        // add in wiggly
        float wiggleFrontHalf = smoothstep(0.1, 0.7, body.x);
        position.z += sin(body.x * PI * 2.0 + (time + timeOffset) * 2.0) * wiggleAmount * wiggleFrontHalf;

        gl_Position = projection * view * model * vec4(position, 1);
        vUV = uvs;
        vIsBody = isBody;
      }
    `),
    uniforms: {
      model: regl.prop('model'),
      view: regl.context('view'),
      projection: regl.context('projection'),
      time: regl.context('time'),
      timeOffset: (context, {timeOffset = 0}) => {
        return timeOffset;
      },
      bodyColor: (context, {bodyColor = [0.010, 0.643, 0.884]}) => {
        return bodyColor;
      },
      finColor: (context, {finColor = [0.951, 0.243, 0.211]}) => {
        return finColor;
      }
    },
    attributes: attributes,
    elements: attributes.cells,
    count: attributes.cells.length * 3,
    depth: {
      enable: false
    },
    blend: {
      enable: true,
      func: { src:'src alpha', dst:'one' }
    },
    cull: {
      enable: false
    }
  });
};
