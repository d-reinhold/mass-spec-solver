const React = require('react');
const Formula = require('components/formula');

class Solutions extends React.Component {
  clearSolutions = () => {
    this.props.update({solutions: null, solutionRows: null});
  };

  render() {
    const {totalCharge, solutions, solutionRows} = this.props;
    let validSolutions = solutions;
    if (totalCharge && solutions) {
      validSolutions = solutions.filter(s => {
        const solutionCharge = s.params.reduce((sum, param, i) => {
          return sum + param * solutionRows[i].charge;
        }, 0);
        return solutionCharge === parseInt(totalCharge, 10);
      });
    }

    return (
      <div className="solutions">
        {validSolutions &&
          <div className="row">
            <h4>{validSolutions.length === 1 ? 'There is 1 solution.' : `There are ${validSolutions.length} solutions.`}</h4>
            <a onClick={this.clearSolutions} className="mlm" href="javascript:void(0)">Clear</a>
            <div className="row">
              <div className="col-md-13">Compound</div>
              <div className="col-md-7">Exact Mass (g/mol)</div>
              <div className="col-md-2">Error</div>
            </div>
            <ul>
              {validSolutions.sort((a, b) => a.percentError - b.percentError).map(solution => {
                return (
                  <li key={solution.params.join('-')} className="row mtm">
                    <div className="col-md-13">
                      {solution.params.map((param, j) => <Formula count={param} fragment={solutionRows[j].coef} key={solutionRows[j].coef}/>)}
                    </div>
                    <div className="col-md-7">
                      {solution.sum.toFixed(4)}
                    </div>
                    <div className="col-md-2">
                      {solution.percentError.toPrecision(3)}%
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        }
      </div>
    );
  }
};

module.exports = Solutions;
