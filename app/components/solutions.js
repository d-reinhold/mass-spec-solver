const React = require('react');
const PureComponent = require('./pure_component');
const Formula = require('components/formula');
const {clearSolutions} = require('runtime/actions');

class Solutions extends PureComponent {
  render() {
    const {totalCharge, solutions} = this.props;
    if (!solutions) return null;
    const {solutionSums, rows, totalMass} = solutions;
    let validSolutions = solutionSums;
    if (totalCharge && validSolutions) {
      validSolutions = solutionSums.filter(s => {
        const solutionCharge = s.params.reduce((sum, param, i) => {
          return sum + param * rows[i].charge;
        }, 0);
        return solutionCharge === parseInt(totalCharge, 10);
      });
    }

    return (
      <div className="solutions">
        {validSolutions &&
          <div className="row">
            <h4>{validSolutions.length === 1 ? 'There is 1 solution.' : `There are ${validSolutions.length} solutions.`}</h4>
            <a onClick={clearSolutions} className="mlm" href="javascript:void(0)">clear solutions</a>
            <div className="row">
              <div className="col-md-13">Compound</div>
              <div className="col-md-7">Exact Mass (g/mol)</div>
              <div className="col-md-4">Abs. Error</div>
            </div>
            <ul>
              {validSolutions.sort((a, b) => a.percentError - b.percentError).map(solution => {
                return (
                  <li key={solution.params.join('-')} className="row mtm solution">
                    <div className="col-md-13">
                      {solution.params.map((param, j) => <Formula count={param} fragment={rows[j].coef} key={rows[j].coef}/>)}
                    </div>
                    <div className="col-md-7">
                      {solution.sum.toFixed(4)}
                    </div>
                    <div className="col-md-2">
                      {Math.abs(solution.sum - totalMass).toFixed(4)}
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
