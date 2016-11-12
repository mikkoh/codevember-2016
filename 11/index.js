const gl = require('glslify');
const regl = require('regl')();
const mat4 = require('gl-mat4');
const getSetupScene = require('./get-setup-scene');
const getFishBody = require('./get-fish-body');
const geoFishBody = require('./geo-fish-body');
const getDrawLoop = require('./get-draw-loop');
const getDrawFullscreen = require('./get-draw-fullscreen');
const touches = require('touches');

const setupScene = getSetupScene(regl);

const drawFish = getFishBody(regl, {
  attributes: geoFishBody, 
  elements: geoFishBody.cells, 
  count: geoFishBody.cells.length * 3
});

const drawFishAdd = getFishBody(regl, {
  attributes: geoFishBody, 
  elements: geoFishBody.cells, 
  count: geoFishBody.cells.length * 3,
  blend: {
    enable: true,
    func: { src:'src alpha', dst:'one' }
  }
});

const colors = [
  [[0.005, 0.321, 0.442], [0.420, 0.121, 0.106]]
];

const state = Array.apply(null, Array(1)).map(() => {
  const maxDist = 5000;
  const minDist = 40;
  const maxOffY = 500;
  const minOffY = -500;
  const distFromCenter = Math.random() * (maxDist - minDist) + minDist;
  const rotateOffset = Math.random() * Math.PI * 2;
  const scale = [1, 1, 1];
  const [bodyColor, finColor] = colors[Math.round((colors.length - 1) * Math.random())];

  return {
    scale,
    rotateOffset,
    bodyColor,
    finColor
  };
});

const blurBuffer = regl.framebuffer({
  color: regl.texture({
    width: window.innerWidth,
    height: window.innerHeight,
    wrap: 'clamp'
  }),
  depth: true
});

const drawBlur = getDrawLoop(regl, {
  outBuffer: blurBuffer,
  frag: gl(`
    precision mediump float;

    #pragma glslify: blur = require('glsl-fast-gaussian-blur/9')
    #define PI 3.141592653589793

    uniform sampler2D texture;
    uniform float iteration;
    uniform float width;
    uniform float height;

    varying vec2 vUV;

    void main() {
      float rad = iteration * PI * 2.0;

      gl_FragColor = blur(texture, vUV, vec2(width, height), vec2(cos(rad), sin(rad)));
    }
  `),
  uniforms: {
    width: window.innerWidth,
    height: window.innerHeight  
  }
});

const drawFullScreen = getDrawFullscreen(regl, {
  blend: {
    enable: true,
    func: { src:'src alpha', dst:'one' }
  },
  depth: {
    enable: false
  }
});

let mousePosition = [window.innerWidth * 0.5, window.innerHeight * 0.5];

const mouse = touches()
  .on('move', (ev, position) => {
    mousePosition = position;
  });

regl.frame(() => {
  setupScene((context, props) => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1
    });

    state.forEach(({rotateOffset, translate, scale, bodyColor, finColor}) => {
      const model = mat4.create();
      const transitionAmount = Math.cos(context.time * 0.5) * 0.4; // (mousePosition[ 0 ] - window.innerWidth * 0.5)  / window.innerWidth * 0.5;

      mat4.rotateX(model, model, Math.PI * 0.1);
      mat4.rotateY(model, model, Math.PI * 0.25);
      mat4.scale(model, model, scale);
      mat4.translate(model, model, [transitionAmount * 200 + 10, 0, 0]);
      
      drawFish({
        model,
        timeOffset: 0.3,
        bodyColor,
        finColor,
        doDrawBody: true,
        doDrawEdge: true
      });

      drawBlur(context, {
        draw: () => {
          drawFish({
            model,
            timeOffset: 0.3,
            bodyColor,
            finColor,
            doDrawBody: false,
            doDrawEdge: true
          });
        },
        iterations: 20
      });

      drawFullScreen({
        texture: blurBuffer
      });

      drawFullScreen({
        texture: blurBuffer
      });

      drawFullScreen({
        texture: blurBuffer
      });

      drawFishAdd({
        model,
        timeOffset: 0.3,
        bodyColor,
        finColor,
        doDrawBody: false,
        doDrawEdge: true
      });
    });
  });
});
