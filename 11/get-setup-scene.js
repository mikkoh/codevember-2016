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
          10000
        );
      },

      view: function ({time}) {
        const view = mat4.create();

        mat4.translate(view, view, [0, 0, -100]);

        return view;
      }
    },

    uniforms: {
      projection: regl.context('projection'),
      view: regl.context('view')
    }
  });
};
