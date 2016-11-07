const mat4 = require('gl-mat4');

module.exports = (regl) => {
  return regl({
    context: {
      projection: function (context) {
        return mat4.perspective(
          [],
          Math.PI / 4,
          context.viewportWidth / context.viewportHeight,
          0.01,
          2000.0
        );
      },

      view: function ({time}, {mouse = [0,0]}) {
        const view = mat4.create();

        mat4.rotateX(view, view, mouse[1] * Math.PI * 0.1);
        mat4.rotateY(view, view, mouse[0] * Math.PI * 0.1);

        return view;
      }
    },
    uniforms: {
      projection: regl.context('projection'),
      view: regl.context('view')
    }
  });
};
