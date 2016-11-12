const gl = require('glslify');

module.exports = (regl, opts) => {
  const drawOpts = Object.assign(
      {
        frag: gl(`
          precision mediump float;

          #pragma glslify: getNoise = require(glsl-noise/simplex/3d)

          varying vec2 vUV;
          varying float vIsBody;
          varying vec4 vPosition;

          uniform float time;
          uniform vec3 bodyColor;
          uniform vec3 finColor;
          uniform bool doDrawBody;
          uniform bool doDrawEdge;

          void main() {
            vec3 color = vec3(0.0);
            
            // float transitionAmount = 1.0 - (vPosition.x + 20.0) / 50.0;
            // float transitionAmount = 1.0 - min(distance(vec3(-40.0, 0.0, -40.0), vPosition.xyz) / 140.0, 1.0);
            float transitionAmount = (vPosition.z + 120.0) / 40.0;
            float noiseScaleMin = 0.13;
            float noiseScaleMax = 0.1;
            float maskEdgeSize = 0.02;

            float noise = getNoise(vPosition.xyz * 0.1);
            float smoothMask = smoothstep(1.0 - transitionAmount + maskEdgeSize, 1.0 - transitionAmount, noise + transitionAmount);
            float mask = smoothMask; // ceil(smoothMask);
              
            if (doDrawBody) {
              color = vIsBody > 0.5 ? bodyColor : finColor;
              color *= mask;  
            }
            
            if (doDrawEdge) {
              float maskEdge = ceil(smoothMask - step(1.0, smoothMask));
              color += maskEdge * vec3(0.980, 0.573, 0.090);
            }

            gl_FragColor = vec4(color, 1);
          }
        `),
        vert: gl(`
          precision mediump float;

          #define PI 3.141592653589793

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
          varying vec4 vPosition;

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

            vPosition = view * model * vec4(position, 1);
            gl_Position = projection * vPosition;
            vUV = uvs;
            vIsBody = isBody;
          }
        `),
        uniforms: {
          model: regl.prop('model'),
          view: regl.context('view'),
          projection: regl.context('projection'),
          time: regl.context('time'),
          doDrawEdge: (context, {doDrawEdge = true}) => {
            return doDrawEdge;
          },
          doDrawBody: (context, {doDrawBody = true}) => {
            return doDrawBody;
          },
          timeOffset: (context, {timeOffset = 0}) => {
            return timeOffset;
          },
          bodyColor: (context, {bodyColor = [0.010, 0.643, 0.884]}) => {
            return bodyColor;
          },
          finColor: (context, {finColor = [0.951, 0.243, 0.211]}) => {
            return finColor;
          }
        }
      },
      opts
  );

  return regl(drawOpts);
};
