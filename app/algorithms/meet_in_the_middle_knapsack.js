function recursiveSolve(rows, sum, params, maxError, maxSum, map) {
  if (rows.length === 0) {
    map.sums.push(sum);
    map.params.push(params);
  } else if (sum < maxSum) {
    for (var param = rows[0].range.min; param <= rows[0].range.max; param++) {
      recursiveSolve(rows.slice(1), sum + param * rows[0].weight, params.concat([param]), maxError, maxSum, map);
    }
  }
}

const MeetInTheMiddleKnapsack = {
  solve(rows, desiredSum, maxError) {
    const maxSum = maxError + desiredSum;
    const mid = Math.floor(rows.length / 2);
    let solutions = [];
    let leftHalf = {sums: [], params: []};
    let rightHalf = {sums: [], params: []};
    recursiveSolve(rows.slice(0, mid), 0, [], maxError, maxSum, leftHalf);
    recursiveSolve(rows.slice(mid), 0, [], maxError, maxSum, rightHalf);
    for (let leftIndex = 0; leftIndex < leftHalf.sums.length; leftIndex++) {
      let leftSum = leftHalf.sums[leftIndex];
      for (let rightIndex = 0; rightIndex < rightHalf.sums.length; rightIndex++) {
        let currentSum = leftSum + rightHalf.sums[rightIndex];
        if (Math.abs(desiredSum - currentSum) < maxError) {
          solutions.push({
            sum: currentSum,
            params: leftHalf.params[leftIndex].concat(rightHalf.params[rightIndex]),
            percentError: Math.abs(1 - currentSum / desiredSum) * 100
          });
        }
      }
    }

    return solutions;
  }
};

module.exports = MeetInTheMiddleKnapsack;
