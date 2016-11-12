const getCube = require('primitive-cube');
const primitiveJoin = require('./primitive-join');
const mat4 = require('gl-mat4');
const vec3 = require('gl-vec3');

const bodyColor = [0.010, 0.643, 0.884];
const finColor = [0.951, 0.243, 0.211];

const geoAll = {};
const geoBody = getCube(40, 5, 5, 40, 10, 10);
geoBody.isBody = geoBody.positions.map(() => {
  return 1;
});

const geoFinTail = getCube(5, 20, 2.5, 5, 5, 5);
const transformFin = mat4.create();
mat4.translate(transformFin, transformFin, [23, 0, 0]);

geoFinTail.positions = geoFinTail.positions.map((position) => {
  return vec3.transformMat4(position, position, transformFin);
});

geoFinTail.isBody = geoFinTail.positions.map(() => {
  return 0;
});

const geoFinBottomFront = getCube(5, 3, 1, 5, 5, 5);
mat4.identity(transformFin);
mat4.translate(transformFin, transformFin, [0, -1.5, 0.5]);
mat4.rotateZ(transformFin, transformFin, Math.PI * 0.05);
mat4.rotateX(transformFin, transformFin, Math.PI * -0.1);
mat4.translate(transformFin, transformFin, [-10, -1, 3]);


geoFinBottomFront.positions = geoFinBottomFront.positions.map((position) => {
  return vec3.transformMat4(position, position, transformFin);
});

geoFinBottomFront.isBody = geoFinBottomFront.positions.map(() => {
  return 0;
});


const geoFinBottomBack = getCube(5, 3, 1, 5, 5, 5);
mat4.identity(transformFin);
mat4.translate(transformFin, transformFin, [0, -1.5, -0.5]);
mat4.rotateZ(transformFin, transformFin, Math.PI * 0.05);
mat4.rotateX(transformFin, transformFin, Math.PI * 0.1);
mat4.translate(transformFin, transformFin, [-10, -1, -3]);


geoFinBottomBack.positions = geoFinBottomBack.positions.map((position) => {
  return vec3.transformMat4(position, position, transformFin);
});

geoFinBottomBack.isBody = geoFinBottomBack.positions.map(() => {
  return 0;
});



const geoFinOnBack = getCube(12, 3, 0.5, 5, 5, 5);
mat4.identity(transformFin);
mat4.translate(transformFin, transformFin, [-2, 3, 0]);

geoFinOnBack.positions = geoFinOnBack.positions.map((position) => {
  return vec3.transformMat4(position, position, transformFin);
});

geoFinOnBack.isBody = geoFinOnBack.positions.map(() => {
  return 0;
});


const geoFinOnBottom = getCube(7, 2, 0.5, 5, 5, 5);
mat4.identity(transformFin);
mat4.translate(transformFin, transformFin, [12, -3, 0]);

geoFinOnBottom.positions = geoFinOnBottom.positions.map((position) => {
  return vec3.transformMat4(position, position, transformFin);
});

geoFinOnBottom.isBody = geoFinOnBottom.positions.map(() => {
  return 0;
});




primitiveJoin(geoAll, geoBody);
primitiveJoin(geoAll, geoFinTail);
primitiveJoin(geoAll, geoFinBottomFront);
primitiveJoin(geoAll, geoFinBottomBack);
primitiveJoin(geoAll, geoFinOnBack);
primitiveJoin(geoAll, geoFinOnBottom);

module.exports = geoAll;