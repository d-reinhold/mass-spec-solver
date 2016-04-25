function recursiveSolve(coefs, ranges, desiredSum, sum, params, solutions, MAX_ERROR, MAX_SUM) {
  if (coefs.length === 0) {
    if (Math.abs(sum - desiredSum) < MAX_ERROR) {
      solutions.push({params: params, sum: sum});
    }
  } else if (sum < MAX_SUM) {
    for (var param = ranges[0][0]; param < ranges[0][1]; param++) {
      recursiveSolve(coefs.slice(1), ranges.slice(1), desiredSum, sum + param * coefs[0], params.concat([param]), solutions, MAX_ERROR, MAX_SUM);
    }
  }
}

const SimpleRecursiveKnapsack = {
  solve(coefs, ranges, desiredSum, MAX_ERROR) {
    let solutions = [];
    const start = Date.now();
    recursiveSolve(coefs, ranges, desiredSum, 0, [], solutions, MAX_ERROR, MAX_ERROR + desiredSum);
    const totalTime = Date.now() - start;
    console.log('Computation took ' + totalTime + 'ms');
    return solutions;
  }
};

module.exports = SimpleRecursiveKnapsack;