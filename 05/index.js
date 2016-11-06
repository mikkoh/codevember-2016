const gl = require('glslify');
const getRegl = require('regl');
const getSetupScene = require('./get-setup-scene');
const getDrawFullScreen = require('./get-draw-full-screen');
const primitiveJoin = require('./primitive-join');

const getPlane = require('primitive-plane');
const planeToCopy = getPlane();
const numPlanes = 13225;

const startTime = Date.now();
const allPlanes = {};
for(var i = 0; i < numPlanes; i++) {
  let color = [Math.random(), 0.4, Math.random()];

  planeToCopy.colors = planeToCopy.positions.map((v, i) => {
    if(i !== 0 && i % 4 === 0) {
      color = [Math.random(), 0.4, Math.random()];
    }

    return color;
  });

  primitiveJoin(allPlanes, planeToCopy);
}
console.log(Date.now() - startTime);


const rowSize = Math.sqrt(allPlanes.positions.length / 4) * 4;
const columnSize = rowSize / 4;

const dataCanvas = document.createElement('canvas');
dataCanvas.width  = rowSize;
dataCanvas.height = columnSize;

const regl = getRegl(dataCanvas);
const reglScreen = getRegl();

const previousFBO = regl.framebuffer({
  color: regl.texture({
    width: rowSize,
    height: columnSize
  }),
  depth: true
});

const currentFBO = regl.framebuffer({
  color: regl.texture({
    width: rowSize,
    height: columnSize
  }),
  depth: true
});

const drawToPreviosFBO = regl({
  framebuffer: previousFBO
});

const drawToCurrentFBO = regl({
  framebuffer: currentFBO
});

const drawData = getDrawFullScreen(regl, {
  frag: gl(`
    #define PI 3.141592653589793
    #define TWO_PI 6.28318530717959

    precision mediump float;

    #pragma glslify: getNoise = require(glsl-noise/simplex/2d)

    uniform vec2 resolution;
    uniform sampler2D previous;
    uniform float time;

    varying vec2 vUV;

    void main() {
      float pixel = 1.0 / resolution.x;
      float planePixels = pixel * 4.0;

      float x = floor(vUV.x / planePixels) * pixel;
      
      float noise = getNoise(vec2(time / 10.0 + x, vUV.y));

      vec4 prev = texture2D(previous, vUV);

      vec4 outColor = prev + vec4(
        cos(noise * TWO_PI), 
        sin(noise * TWO_PI) * cos(noise * TWO_PI * 1.3), 
        sin(noise * TWO_PI * 0.6) * cos(noise * TWO_PI), 
        1.0
      );

      outColor.xyz = (outColor.xyz + vec3(1.0)) * 0.5;

      gl_FragColor = outColor;
    }
  `),
  uniforms: {
    previous: regl.prop('previous'),
    resolution: regl.prop('resolution'),
    time: ({time}) => {
      return time;
    }
  }
});

const drawDataTexture = getDrawFullScreen(regl, {
  frag: `
    precision mediump float;

    uniform sampler2D texture;

    varying vec2 vUV;

    void main() {
      gl_FragColor = texture2D(texture, vUV);
    }
  `,
  uniforms: {
    texture: regl.prop('texture')
  }
});

const setupScene = getSetupScene(reglScreen);

const drawOut = getDrawFullScreen(reglScreen, {
  frag: `
    precision mediump float;

    uniform sampler2D texture;

    varying vec2 vUV;

    void main() {
      gl_FragColor = texture2D(texture, vUV);
    }
  `,
  uniforms: {
    texture: regl.prop('texture')
  }
});

const offsetsBuffer = reglScreen.buffer(allPlanes.positions.length);

const drawPlanes = reglScreen({
  frag: `
    precision mediump float;

    varying vec2 vUV;
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `,
  vert: `
    uniform mat4 projection;
    uniform mat4 view;

    attribute vec3 positions;
    attribute vec3 colors;
    attribute vec4 offsets;
    attribute vec2 uvs;

    varying vec2 vUV;
    varying vec3 vColor;

    void main() {
      vec3 offset = offsets.xyz / 255.0 * 2.0 - 1.0;
      float brightness = (offset.z + 1.0) * 0.5;
      offset *= 20.0;

      gl_Position = projection * view * vec4(positions + offset, 1);
      vUV = uvs;
      vColor = colors * brightness;
    }
  `,
  attributes: Object.assign(
    allPlanes,
    {
      offsets: offsetsBuffer
    }
  ),
  elements: allPlanes.cells,
  count: allPlanes.cells.length * 3
});

regl.frame(({time}) => {
  drawToCurrentFBO(() => {
    regl.clear({
      color: [0.9, 0.9, 0.9, 1],
      depth: 1
    });

    drawData({
      previous: previousFBO,
      resolution: [dataCanvas.width, dataCanvas.height]
    });

    const data = regl.read();

    // drop in calculated offsets
    offsetsBuffer({
      data
    });
  });

  setupScene({ rotation: [Math.cos(time * 0.5) * Math.PI * 0.25, Math.sin(time * 0.5) * Math.PI * 0.3]}, () => {
    reglScreen.clear({
      color: [0.9, 0.9, 1.0, 1],
      depth: 1
    });

    drawPlanes({
      attributes: allPlanes,
      elements: allPlanes.cells,
      count: allPlanes.cells.length * 3
    });
  });
  

  drawToPreviosFBO(() => {
    drawDataTexture({
      texture: currentFBO
    });
  });

  


  // setupScene(({time, projection, view}) => {
  //   regl.clear({
  //     color: [0.9, 0.9, 0.9, 1],
  //     depth: 1
  //   });

  //   draw();
  // });
});
