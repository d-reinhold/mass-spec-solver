const React = require('react');
const AWS = require('aws-sdk');
const VelocityTransitionGroup = require('helpers/velocity_transition_group');
const {Icon} = require('pui-react-iconography');
const {Input} = require('pui-react-inputs');
const {HighlightButton} = require('pui-react-buttons');
const {Tooltip} = require('pui-react-tooltip');
const {OverlayTrigger} = require('pui-react-overlay-trigger');
const range = require('lodash.range');
const clone = require('lodash.clone');
const cloneDeep = require('lodash.clonedeep');
const SolveHelper = require('../helpers/solve_helper');

class SolvePage extends React.Component {
  solve = () => {
    const {totalMass, maxError, rows} = this.props;
    this.props.update({solving: true});
    const formattedRows = rows.map(row => {
      return {weight: parseFloat(row.weight), range: {min: parseInt(row.range.min, 10), max: parseInt(row.range.max, 10)}};
    });
    const lambda = new AWS.Lambda();
    lambda.invoke({
      FunctionName: 'recursiveSubsetSum',
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Payload: JSON.stringify({desiredSum: parseFloat(totalMass), maxError: parseFloat(maxError), rows: formattedRows})
    }, (err, data) => {
      this.props.update({solving: false});
      if (err) {
        console.error(err, err.stack);
      } else {
        this.props.update({solutions: JSON.parse(data.Payload).solutions, solutionRows: cloneDeep(rows)});
      }
    });
  };

  addRow = () => {
    this.props.update({rows: [SolveHelper.emptyRow()].concat(this.props.rows)});
  };

  removeRow = (i) => {
    let newRows = clone(this.props.rows);
    newRows.splice(i, 1);
    this.props.update({rows: newRows});
  };

  updateTotalMass = (e) => {
    this.props.update({totalMass: SolveHelper.parseNumeric(e.target.value)});
  };

  updateTotalCharge = (e) => {
    this.props.update({totalCharge: SolveHelper.parseNumeric(e.target.value)});
  };

  updateMaxError = (e) => {
    this.props.update({maxError: SolveHelper.parseNumeric(e.target.value)});
  };

  updateCoef = (i, e) => {
    let newRows = clone(this.props.rows);
    newRows[i].coef = e.target.value;
    newRows[i].weight = SolveHelper.computeWeight(newRows[i]);
    this.props.update({rows: newRows});
  };

  updateRange = (i, type, e) => {
    let newRows = clone(this.props.rows);
    newRows[i].range[type] = SolveHelper.parseNumeric(e.target.value);
    this.props.update({rows: newRows});
  };

  updateCharge = (i, e) => {
    let newRows = clone(this.props.rows);
    newRows[i].charge = parseInt(e.target.value, 10);
    newRows[i].weight = SolveHelper.computeWeight(newRows[i]);
    this.props.update({rows: newRows});
  };

  clearSolutions = () => {
    this.props.update({solutions: null});
  };

  render() {
    const {totalMass, totalCharge, maxError, rows, solutions, solutionRows, solving, page} = this.props;
    let solveDisabled = solving || rows.length === 0 || !rows.every(row => row.weight) || totalMass === 0 || totalMass === '' || maxError === 0 || maxError === '';
    const numCombinations = rows.map(row => (row.range.max - row.range.min) + 1).reduce((val, product) => val * product, 1);
    let coefInputs = rows.map((row, rowIndex) => {
      const chargeOptions = range(8, -9).map(charge => {
        const chargeLabel = charge > 0 ? `+${charge}` : charge;
        return <option value={charge} key={charge}>{chargeLabel}</option>;
      });

      const weightInvalid = isNaN(row.weight) || row.weight === 0;
      solveDisabled = solveDisabled || weightInvalid;

      return (
        <div className="fragment" key={row.id}>
          <div className="form-group row">
            <div className="form-group col-xs-13">
              <span className={`shadow-text ${weightInvalid ? 'invalid' : ''}`}>
                {weightInvalid ? <Icon name="question-circle-o" size="h3"/> : row.weight}
              </span>
              <label>Fragment, Element or Mass (g/mol)</label>
              <input className="form-control" placeholder="Enter a fragment" value={row.coef} onChange={this.updateCoef.bind(this, rowIndex)} autoFocus={rowIndex===0}/>
            </div>
            <div className="col-xs-3 form-group">
              <label>Charge</label>
              <select className="form-control" value={row.charge} onChange={this.updateCharge.bind(this, rowIndex)}>
                {chargeOptions}
              </select>
            </div>
            <Input label="Min" className="col-xs-3" value={row.range.min} onChange={this.updateRange.bind(this, rowIndex, 'min')}/>
            <Input label="Max" className="col-xs-3" value={row.range.max} onChange={this.updateRange.bind(this, rowIndex, 'max')}/>
            <a href="javascript:void(0)" className="action-icon col-xs-2 ptxxl" onClick={this.removeRow.bind(this, rowIndex)}>
              <OverlayTrigger placement="top" overlay={<Tooltip>Remove this Fragment</Tooltip>}>
                <Icon name="close" size="h3"/>
              </OverlayTrigger>
            </a>
          </div>
        </div>
      );
    });
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
      <form>
        <div className="main-inputs">
          <div className="search form-group row">
            <Input label="Total Mass" className="col-xs-8" value={totalMass} onChange={this.updateTotalMass}/>
            <Input label="Total Charge (optional)" className="col-xs-8" value={totalCharge} onChange={this.updateTotalCharge}/>
            <Input label="Max Error" className="col-xs-8" value={maxError} onChange={this.updateMaxError}/>
          </div>
          <div>
            <HighlightButton onClick={this.solve} type="button" className="phxxl" disabled={solveDisabled}>{solving ? 'Solving' : 'Solve!'}</HighlightButton>
          </div>
          <span className="num-combinations">{`${numCombinations} combinations to search.`}</span>
        </div>
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
                        {
                          solution.params
                            .map((param, j) => {
                               if (param === 0) return '';
                               const formula = solutionRows[j].coef.split('').map((char, charIndex) => {
                                 return isFinite(char) ? <sub key={charIndex}>{char}</sub> : <span key={charIndex}>{char}</span>;
                               });
                               return <span className="mlxs" key={solutionRows[j].coef}>({formula})<sub>{param}</sub></span>;
                             })
                        }
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
        <div className="fragments">
          <VelocityTransitionGroup transitionName="slide-forward" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
            <div className="fragment" key="9999">
              <div className="row">
                <div className="col-xs-22"></div>
                <a href="javascript:void(0)" className="action-icon col-xs-2 ptm" onClick={this.addRow}>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Add a Fragment</Tooltip>}>
                    <Icon name="plus-circle" size="h3"/>
                  </OverlayTrigger>
                </a>
              </div>
            </div>
            {coefInputs}
          </VelocityTransitionGroup>
        </div>
      </form>
    );
  }
}

module.exports = SolvePage;
