const ElementalMassHelper = require('helpers/elemental_mass_helper');

function normalizeCoefs(fragments, charges) {
  return fragments.map((fragment, i) => {
    let weight = ElementalMassHelper.fragments[fragment];
    if (!weight) {
      if (fragment.match(/(\d+)/g) && fragment.match(/(\d+)/g)[0] === fragment) {
        weight = parseFloat(fragment, 10);
      } else {
        weight = fragment.split(/([A-Z]?[^A-Z]*)/g).filter(e => !!e).map(e => {
          let [element, count] = e.split(/(\d+)/g);
          count = parseInt(count, 10) || 1;
          weight = ElementalMassHelper.elements[element];
          return element ? weight * count : ElementalMassHelper.fragments[element];
        }).reduce((w, sum) => w + sum, 0);
      }
    }
    return charges[i] ? weight - ElementalMassHelper.electron * charges[i] : weight;
  });
}

function recursiveSolve(coefs, ranges, desiredSum, sum, params, solutions, maxError, maxSum) {
  if (coefs.length === 0) {
    if (Math.abs(sum - desiredSum) < maxError) {
      solutions.push({params: params, sum: sum});
    }
  } else if (sum < maxSum) {
    for (var param = ranges[0][0]; param < ranges[0][1]; param++) {
      recursiveSolve(coefs.slice(1), ranges.slice(1), desiredSum, sum + param * coefs[0], params.concat([param]), solutions, maxError, maxSum);
    }
  }
}

const SimpleRecursiveKnapsack = {
  solve(coefs, ranges, charges, desiredSum, maxError) {
    let solutions = [];
    const start = Date.now();
    recursiveSolve(normalizeCoefs(coefs, charges), ranges, desiredSum, 0, [], solutions, maxError, maxError + desiredSum);
    const totalTime = Date.now() - start;
    console.log('Computation took ' + totalTime + 'ms');
    return solutions;
  }
};

module.exports = SimpleRecursiveKnapsack;