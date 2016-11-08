const getPieceRing = require('geo-piecering');
const primitiveJoin = require('./primitive-join');

const pieceRing = {};

primitiveJoin(pieceRing, getPieceRing({
  radius: 7,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 0.6,
  y: 20
}));

primitiveJoin(pieceRing, getPieceRing({
  radius: 8,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 0.2,
  y: 18,
  startRadian: Math.PI * 0.1
}));

primitiveJoin(pieceRing, getPieceRing({
  radius: 10,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 2,
  y: 16,
  startRadian: Math.PI * 0.1
}));

for(var i = 0; i < 40; i++) {
  primitiveJoin(pieceRing, getPieceRing({
    radius: Math.random() * 20,
    pieceSize: Math.PI * 0.02,
    numPieces: 10,
    height: 0.3,
    y: -20 + i * 0.4,
    startRadian: Math.random()
  }));
}

module.exports = pieceRing;