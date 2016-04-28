const ElementalMassHelper = require('helpers/elemental_mass_helper');

function normalizeCoefs(coefs, charges) {
  return coefs.map((coef, i) => {
    const weight = ElementalMassHelper.elements[coef] * 100000 || parseInt(coef, 10);
    return charges[i] ? weight + ElementalMassHelper.electron * -100000 * charges[i] : weight;
  });
}

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
  solve(coefs, ranges, charges, desiredSum, MAX_ERROR) {
    let solutions = [];
    const start = Date.now();
    recursiveSolve(normalizeCoefs(coefs, charges), ranges, desiredSum, 0, [], solutions, MAX_ERROR, MAX_ERROR + desiredSum);
    const totalTime = Date.now() - start;
    console.log('Computation took ' + totalTime + 'ms');
    return solutions;
  }
};

module.exports = SimpleRecursiveKnapsack;