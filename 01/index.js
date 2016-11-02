const touches = require('touches');
const regl = require('regl')();
const createPlane = require('primitive-plane');

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

function handleMouseMove(ev, position) {
  const size = 20;
  const [x, y] = position.map((value) => {
    return value - size * 0.5;
  });

  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#FFF';
  context.fillRect(x, y, size, size);
}

let fillColor = [Math.random(), Math.random(), Math.random()];

const mouseHandler = touches(window, {target: canvas})
  .on('start', function() {
    fillColor = [Math.random(), Math.random(), Math.random()];
    mouseHandler.on('move', handleMouseMove);
  })
  .on('end', function() {
    mouseHandler.removeListener('move', handleMouseMove);
  });
  

const plane = createPlane(2, 2, 1, 1);

const drawPlane = regl({
  frag: `
  precision mediump float;

  uniform sampler2D texture;
  varying vec2 vUV;

  void main() {
    gl_FragColor = texture2D(texture, vUV);
  }`,
  vert: `
  attribute vec3 positions;
  attribute vec2 uvs;

  varying vec2 vUV;

  void main() {
    vUV = uvs;
    gl_Position = vec4(positions, 1);
  }`,
  attributes: plane,
  elements: plane.cells,
  count: plane.cells.length * 3,
  uniforms: {
    texture: regl.prop('texture')
  }
});

const drawMaskPlane = regl({
  frag: `
  precision mediump float;

  uniform vec3 fillColor;
  uniform sampler2D textureCanvas;
  uniform sampler2D texture2;
  varying vec2 vUV;

  void main() {
    vec4 colorCanvas = texture2D(textureCanvas, vUV);
    vec4 colorFBO = texture2D(texture2, vUV);
    vec4 color = vec4(colorCanvas.rgb * fillColor, colorCanvas.a);
    
    color += colorFBO;

    gl_FragColor = color;
  }`,
  vert: `
  attribute vec3 positions;
  attribute vec2 uvs;

  varying vec2 vUV;

  void main() {
    vUV = uvs;
    gl_Position = vec4(positions, 1);
  }`,
  attributes: plane,
  elements: plane.cells,
  count: plane.cells.length * 3,
  uniforms: {
    fillColor: regl.prop('fillColor'),
    textureCanvas: regl.prop('textureCanvas'),
    texture2: regl.prop('texture2')
  }
});

const drawPlaneGrowing = regl({
  frag: `
  precision mediump float;

  uniform sampler2D texture;
  uniform vec2 resolution;

  varying vec2 vUV;
  
  void main() {
    vec4 color = vec4(0);
    vec4 outColor = vec4(0);
    vec2 inc = vec2(1) / resolution;

    color += texture2D(texture, vUV + vec2(inc.x, 0));
    color += texture2D(texture, vUV + inc);
    color += texture2D(texture, vUV + vec2(0, inc.y));
    color += texture2D(texture, vUV + vec2(-inc.x, inc.y));
    color += texture2D(texture, vUV + vec2(-inc.x, 0));
    color += texture2D(texture, vUV + -inc);
    color += texture2D(texture, vUV + vec2(0, -inc.y));
    color += texture2D(texture, vUV + vec2(inc.x, -inc.y));

    color /= 8.0;

    if(color.r > color.b && color.r > color.g) {
      outColor.rgb = vec3(color.r, 0.0, 0.0);
    } else if(color.g > color.r && color.g > color.b) {
      outColor.rgb = vec3(0.0, color.g, 0.0);
    } else {
      outColor.rgb = vec3(0.0, 0.0, color.b);
    }

    outColor.a = 1.0;

    gl_FragColor = outColor;
  }`,
  vert: `
  attribute vec3 positions;
  attribute vec2 uvs;
  
  varying vec2 vUV;

  void main() {
    vUV = uvs;

    gl_Position = vec4(positions, 1);
  }`,
  attributes: plane,
  elements: plane.cells,
  count: plane.cells.length * 3,
  uniforms: {
    texture: regl.prop('texture'),
    fillColor: regl.prop('fillColor'),
    resolution: [canvas.width, canvas.height]
  }
});

const fbo1 = regl.framebuffer({
  color: regl.texture({
    width: canvas.width,
    height: canvas.height,
    wrap: 'clamp'
  }),
  depth: true
});

const fbo2 = regl.framebuffer({
  color: regl.texture({
    width: canvas.width,
    height: canvas.height,
    wrap: 'clamp'
  }),
  depth: true
});

const drawToFBO1 = regl({
  framebuffer: fbo1
});

const drawToFBO2 = regl({
  framebuffer: fbo2
});

regl.frame(({deltaTime, viewportWidth, viewportHeight}) => {
  fbo1.resize(viewportWidth, viewportHeight);

  drawToFBO1({}, () => {
    regl.clear({
      color: [0, 0, 0, 255],
      depth: 1
    });

    drawMaskPlane({
      fillColor: fillColor,
      textureCanvas: regl.texture(canvas),
      texture2: fbo2
    });
  });

  drawToFBO2({}, () => {
    regl.clear({
      color: [0, 0, 0, 255],
      depth: 1
    });

    drawPlaneGrowing({
      texture: fbo1
    });
  });

  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  });

  drawPlane({
    texture: fbo2
  });
});
