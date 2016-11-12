const getDrawFullscreen = require('./get-draw-fullscreen');

module.exports = function(regl, opts) {
  const {outBuffer, frag, clearColor = [0, 0, 0, 1]} = opts;

  const fbo1 = regl.framebuffer({
    color: regl.texture({
      width: outBuffer.width,
      height: outBuffer.height,
      wrap: 'clamp'
    }),
    depth: true
  });

  const drawToFBO1 = regl({
    framebuffer: fbo1
  });

  const drawToOutput = regl({
    framebuffer: outBuffer
  });

  const drawFullScreen = getDrawFullscreen(regl, {
    frag,
    uniforms: Object.assign(
      {
        texture: regl.prop('texture'),
        iteration: regl.prop('iteration')
      }, 
      opts.uniforms
    )
  });

  return (context, {draw, iterations = 10}) => {
    if (iterations % 2) {
      throw new Error('iterations should be a whole number');
    }

    drawToFBO1({}, () => {
      regl.clear({
        color: clearColor,
        depth: 1
      });

      draw();
    });

    let currentDraw = drawToOutput;
    let currentTexture = fbo1;

    for (var i = 0; i < iterations - 1; i++) {
      currentDraw({}, () => {
        regl.clear({
          color: clearColor,
          depth: 1
        });

        drawFullScreen({
          texture: currentTexture,
          iteration: (i + 1) / iterations
        });
      });

      if (currentDraw === drawToFBO1) {
        currentDraw = drawToOutput;
        currentTexture = fbo1;
      } else {
        currentDraw = drawToFBO1;
        currentTexture = outBuffer;
      }
    }
  };
};
