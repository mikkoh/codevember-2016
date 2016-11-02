const touches = require('touches');
const regl = require('regl')();
const createPlane = require('primitive-plane');
const load = require('async-image-loader')



load(['1.jpg', '2.jpg', '3.jpg'], ([image1, image2, image3]) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  function handleMouseMove(ev, position) {
    const size = Math.random() * 20 + 3;
    const [x, y] = position.map((value) => {
      return value - size * 0.5;
    });

    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#FFF';
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.fill();
    // context.fillRect(x, y, size, size);
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

  const drawPlaneWithImages = regl({
    frag: `
    precision mediump float;

    uniform sampler2D masker;
    uniform sampler2D image1;
    uniform sampler2D image2;
    uniform sampler2D image3;
    varying vec2 vUV;

    void main() {
      vec4 cMasker = texture2D(masker, vUV);
      vec4 color1 = texture2D(image1, vUV);
      vec4 color2 = texture2D(image2, vUV);
      vec4 color3 = texture2D(image3, vUV);

      vec4 color = vec4(0);

      color += color1 * cMasker.r;
      color += color2 * cMasker.g;
      color += color3 * cMasker.b;
      color.a = 1.0;

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
      masker: regl.prop('masker'),
      image1: regl.texture(image1),
      image2: regl.texture(image2),
      image3: regl.texture(image3)
    }
  });

  const drawMaskerPlane = regl({
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

      drawMaskerPlane({
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

    drawPlaneWithImages({
      masker: fbo2
    });
  });
});
