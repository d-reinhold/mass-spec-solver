const AWS = require('aws-sdk');

const algorithms = {
  simple: require('algorithms/simple_recursive_knapsack'),
  mitm: require('algorithms/meet_in_the_middle_knapsack')
};

const lambdaFunctions = {
  simple: 'MassSpecSolverSimpleRecursiveKnapsack',
  mitm: 'MassSpecSolverMeetInTheMiddleKnapsack'
};

const Knapsack = {
  solve(strategy, rows, desiredSum, maxError) {
    const start = Date.now();
    const solver = algorithms[strategy.algorithm] || algorithms.mitm;

    return new Promise((resolve, reject) => {
      if (strategy.offline) {
        setTimeout(() => {
          // timeout here is to allow React to rerender the UI once
          // before we start executing a very expensive function.
          resolve(solver.solve(rows, desiredSum, maxError));
        }, 0);
      } else {
        const lambda = new AWS.Lambda();
        lambda.invoke({
          FunctionName: lambdaFunctions[strategy.algorithm] || lambdaFunctions.mitm,
          InvocationType: 'RequestResponse',
          LogType: 'None',
          Payload: JSON.stringify({desiredSum, maxError, rows})
        }, (err, data) => {
          if (err) {
            console.error(err, err.stack);
            reject(err);
          } else {
            resolve(JSON.parse(data.Payload).solutions);
          }
        });
      }
    }).then((solutions) => {
      console.log(`Computation took ${Date.now() - start} ms`);
      return solutions;
    });
  }
};

module.exports = Knapsack;