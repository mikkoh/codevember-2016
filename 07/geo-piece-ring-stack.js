const getPieceRing = require('geo-piecering');
const primitiveJoin = require('./primitive-join');

const pieceRing = {};

primitiveJoin(pieceRing, getPieceRing({
  radius: 7,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 0.6
}));

primitiveJoin(pieceRing, getPieceRing({
  radius: 8,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 1,
  y: -2,
  startRadian: Math.PI * 0.1
}));

primitiveJoin(pieceRing, getPieceRing({
  radius: 10,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 2,
  y: -4,
  startRadian: Math.PI * 0.1
}));

module.exports = pieceRing;