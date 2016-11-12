module.exports = function(allPrimitives, newPrimitive) {
  let cellOffset = 0;

  if(allPrimitives.positions) {
    cellOffset = allPrimitives.positions.length;
  }

  for (var attributeName in newPrimitive) {
    if (!allPrimitives[attributeName]) {
      allPrimitives[attributeName] = [];
    }

    if (attributeName !== 'cells') {
      allPrimitives[attributeName] = allPrimitives[attributeName].concat(newPrimitive[attributeName]);
    } else {
      const newCells = newPrimitive[attributeName].map((cell) => {
        return cell.slice().map(idx => idx + cellOffset);
      });

      allPrimitives[attributeName] = allPrimitives[attributeName].concat(newCells);
    }
  }
};
