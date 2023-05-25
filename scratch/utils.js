function findPattern(matrix, submatrix) {
    loopX: for (let x = 0; x < matrix.length - submatrix.length + 1; ++x) {
        loopY: for (let y = 0; y < matrix[x].length - submatrix[0].length + 1; ++y) {
          for (let xx = 0; xx < submatrix.length; ++xx) {
            for (let yy = 0; yy < submatrix[0].length; ++yy) {
              if (!matrix[x + xx][y + yy].equals(submatrix[xx][yy])) {
                continue loopY;
              }
            }
          }
      
          return true;
          break loopX;
        }
      }

      return false;
} 

if (module && module.exports) {
    module.exports = {findPattern};
}