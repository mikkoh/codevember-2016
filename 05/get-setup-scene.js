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
          1000.0
        );
      },

      view: function (context, {rotation}) {
        const view = mat4.create();

        mat4.translate(view, view, [0, 0, -100]);
        mat4.rotateX(view, view, rotation[0]);
        mat4.rotateY(view, view, rotation[1]);

        return view;
      }
    },

    uniforms: {
      rotation: (context, {rotation = [0, 0]}) => {
        return rotation;
      },
      projection: regl.context('projection'),
      view: regl.context('view')
    }
  });
};
