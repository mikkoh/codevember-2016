const mat4 = require('gl-mat4');

module.exports = (rotate, translate, model = mat4.create()) => {
  const mat = model.slice();
  const [rotateX, rotateY, rotateZ] = rotate;

  mat4.translate(mat, mat, translate);

  mat4.rotateX(mat, mat, rotateX);
  mat4.rotateY(mat, mat, rotateY);
  mat4.rotateZ(mat, mat, rotateZ);

  return mat;
};
