function recursiveSolve(rows, sum, params, maxError, maxSum, sums) {
  if (rows.length === 0) {
    sums.push({sum, params});
  } else if (sum < maxSum) {
    for (var param = rows[0].range.min; param <= rows[0].range.max; param++) {
      recursiveSolve(rows.slice(1), sum + param * rows[0].weight, params.concat([param]), maxError, maxSum, sums);
    }
  }
}

const MeetInTheMiddleWithBinarySearchKnapsack = {
  solve(rows, desiredSum, maxError) {
    const start= Date.now();
    const maxSum = maxError + desiredSum;
    const midRow = Math.floor(rows.length / 2);
    let solutions = [];
    let leftHalf = [];
    let rightHalf = [];
    recursiveSolve(rows.slice(0, midRow), 0, [], maxError, maxSum, leftHalf);
    recursiveSolve(rows.slice(midRow), 0, [], maxError, maxSum, rightHalf);
    rightHalf = rightHalf.sort((a, b) => a.sum - b.sum);
    for (let leftIndex = 0; leftIndex < leftHalf.length; leftIndex++) {
      let targetRightSum = desiredSum - leftHalf[leftIndex].sum;
      // binary search
      let low = 0;
      let high = rightHalf.length;
      let mid;
      while (true) {
        mid = Math.floor((low + high) / 2);
        if (Math.abs(targetRightSum - rightHalf[mid].sum) < maxError) {
          // found a value that's close enough!
          // go backwards and forward from this value to find them all!
          let curr = mid, actualSum;
          while (curr >= 0 && Math.abs(targetRightSum - rightHalf[curr].sum) < maxError) {
            actualSum = leftHalf[leftIndex].sum + rightHalf[curr].sum;
            solutions.push({
              sum: actualSum,
              params: leftHalf[leftIndex].params.concat(rightHalf[curr].params),
              percentError: Math.abs(1 - actualSum / desiredSum) * 100
            });
            curr = curr - 1;
          }
          curr = mid + 1;
          while (curr < rightHalf.length && Math.abs(targetRightSum - rightHalf[curr].sum) < maxError) {
            actualSum = leftHalf[leftIndex].sum + rightHalf[curr].sum;
            solutions.push({
              sum: actualSum ,
              params: leftHalf[leftIndex].params.concat(rightHalf[curr].params),
              percentError: Math.abs(1 - actualSum / desiredSum) * 100
            });
            curr = curr + 1;
          }
          break;
        } else if (mid === high || mid === low) {
          break;
        } else if (targetRightSum - rightHalf[mid].sum < 0) {
          // mid is too big, search between low and mid
          high = mid;
        } else if (targetRightSum - rightHalf[mid].sum > 0) {
          // mid is too small, search between mid and high
          low = mid;
        } else {
          throw 'wtf';
        }
      }
    }

    return solutions;
  }
};

module.exports = MeetInTheMiddleWithBinarySearchKnapsack;
