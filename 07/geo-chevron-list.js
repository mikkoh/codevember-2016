const getChevron = require('geo-chevron');
const mat4 = require('gl-mat4');
const vec3 = require('gl-vec3');
const primitiveJoin = require('./primitive-join');

const allGeo = {};
const translate = mat4.create();

for(var i = 0; i < 10; i++) {
  let chevron = getChevron({
    width: 2,
    depth: 2,
    thickness: 1
  });

  mat4.translate(translate, translate, [1.5, 0, 0]);
  chevron.positions.forEach((position) => {
    vec3.transformMat4(position, position, translate);
  });

  primitiveJoin(allGeo, chevron);
}


module.exports = allGeo;