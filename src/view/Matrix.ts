
export function inverse(matrix: number[], setMatrix: number[]): void {
  const [a, b, c, d, e, f] = matrix
  let det = 1 / (a * d - c * b);
  
  setMatrix[0] = d * det;
  setMatrix[1] = -c * det;
  setMatrix[2] = -b * det;
  setMatrix[3] = a * det;
  setMatrix[4] = (b * f - e * d) * det;
  setMatrix[5] = (e * b - a * f) * det;
};