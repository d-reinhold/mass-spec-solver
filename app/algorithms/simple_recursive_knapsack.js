function recursiveSolve(rows, desiredSum, sum, params, solutions, maxError, maxSum) {
  if (rows.length === 0) {
    if (Math.abs(sum - desiredSum) < maxError) {
      solutions.push({params, sum});
    }
  } else if (sum < maxSum) {
    for (var param = rows[0].range.min; param <= rows[0].range.max; param++) {
      recursiveSolve(rows.slice(1), desiredSum, sum + param * rows[0].weight, params.concat([param]), solutions, maxError, maxSum);
    }
  }
}

const SimpleRecursiveKnapsack = {
  solve(rows, desiredSum, maxError) {
    let solutions = [];
    recursiveSolve(rows, desiredSum, 0, [], solutions, maxError, maxError + desiredSum);
    return solutions;
  }
};

module.exports = SimpleRecursiveKnapsack;