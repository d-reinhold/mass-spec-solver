function recursiveSolve(coefs, ranges, desiredSum, sum, params, solutions, maxError, maxSum) {
  if (coefs.length === 0) {
    if (Math.abs(sum - desiredSum) < maxError) {
      solutions.push({params: params, sum: sum});
    }
  } else if (sum < maxSum) {
    for (var param = ranges[0][0]; param <= ranges[0][1]; param++) {
      recursiveSolve(coefs.slice(1), ranges.slice(1), desiredSum, sum + param * coefs[0], params.concat([param]), solutions, maxError, maxSum);
    }
  }
}

const SimpleRecursiveKnapsack = {
  solve(coefs, ranges, desiredSum, maxError) {
    let solutions = [];
    const start = Date.now();
    recursiveSolve(coefs, ranges, desiredSum, 0, [], solutions, maxError, maxError + desiredSum);
    const totalTime = Date.now() - start;
    console.log('Computation took ' + totalTime + 'ms');
    return solutions;
  }
};

module.exports = SimpleRecursiveKnapsack;