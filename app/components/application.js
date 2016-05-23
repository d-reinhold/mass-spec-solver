const React = require('react');
const {Icon} = require('pui-react-iconography');
const {Input} = require('pui-react-inputs');
const {HighlightButton} = require('pui-react-buttons');
const {Tooltip} = require('pui-react-tooltip');
const {OverlayTrigger} = require('pui-react-overlay-trigger');
const SimpleRecursiveKnapsack = require('algorithms/simple_recursive_knapsack');
const VelocityTransitionGroup = require('helpers/velocity_transition_group');
const ElementalMassHelper = require('helpers/elemental_mass_helper');
const range = require('lodash.range');


function computeWeight({coef, charge}) {
  let weight = ElementalMassHelper.fragments[coef];
  if (!weight) {
    if (coef.match(/(\d+)/g) && coef.match(/(\d+)/g)[0] === coef) {
      weight = parseFloat(coef, 10);
    } else {
      weight = coef.split(/([A-Z]?[^A-Z]*)/g).filter(e => !!e).map(e => {
        let [element, count] = e.split(/(\d+)/g);
        count = parseInt(count, 10) || 1;
        weight = ElementalMassHelper.elements[element];
        return element ? weight * count : ElementalMassHelper.fragments[element];
      }).reduce((w, sum) => w + sum, 0);
    }
  }
  return (charge === 0 ? weight : weight - ElementalMassHelper.electron * charge).toPrecision(9);
}

function emptyRow() {
  return {
    id: Math.random(),
    coef: '',
    range: {min: 0, max: 5},
    charge: 0,
    weight: null
  };
}

function parseNumeric(value) {
  return value.replace(/[^0-9.]+/g, '');
}

class Application extends React.Component {
  constructor(props, context) {
    super(props, context);
    const urlParams = location.search.slice(1).split('&').map(val => val && JSON.parse(decodeURIComponent(val.split('=')[1]) || '""'));
    this.state = {
      desiredSum: urlParams[0] || 0,
      maxError: urlParams[1] || 0.01,
      rows: urlParams[2] || [emptyRow()],
      solutionRows: null,
      solutions: null,
      solving: false
    };
  }

  updateRoute = () => {
    const {desiredSum, maxError, rows} = this.state;
    history.pushState(null, null, `?desiredSum=${JSON.stringify(desiredSum)}&maxError=${JSON.stringify(maxError)}&rows=${JSON.stringify(rows)}`);
  };

  solve = () => {
    const {desiredSum, maxError, rows} = this.state;
    this.setState({solving: true});
    setTimeout(() => {
      this.setState({
        solutions: SimpleRecursiveKnapsack.solve(rows, parseFloat(desiredSum), parseFloat(maxError)),
        solutionRows: rows.slice(0),
        solving: false
      });
    });
  };

  addRow = () => {
    this.setState({
      rows: [emptyRow()].concat(this.state.rows)
    }, this.updateRoute.bind(this));
  };

  removeRow = (i) => {
    let newRows = this.state.rows.slice(0);
    newRows.splice(i, 1);
    this.setState({rows: newRows}, this.updateRoute.bind(this));
  };

  updateDesiredSum = (e) => {
    this.setState({desiredSum: parseNumeric(e.target.value)}, this.updateRoute.bind(this));
  };

  updateMaxError = (e) => {
    this.setState({maxError: parseNumeric(e.target.value)}, this.updateRoute.bind(this));
  };

  updateCoef = (i, e) => {
    let newRows = this.state.rows.slice(0);
    newRows[i].coef = e.target.value;
    newRows[i].weight = computeWeight(newRows[i]);
    this.setState({rows: newRows}, this.updateRoute.bind(this));
  };

  updateRange = (i, type, e) => {
    let newRows = this.state.rows.slice(0);
    newRows[i].range[type] = parseNumeric(e.target.value);
    this.setState({rows: newRows}, this.updateRoute.bind(this));
  };

  updateCharge = (i, e) => {
    let newRows = this.state.rows.slice(0);
    newRows[i].charge = parseInt(e.target.value, 10);
    newRows[i].weight = computeWeight(newRows[i]);
    this.setState({rows: newRows}, this.updateRoute.bind(this));
  };

  clearSolutions = () => {
    this.setState({solutions: null});
  };

  render() {
    const {desiredSum, maxError, rows, solutions, solutionRows, solving} = this.state;
    const numCombinations = rows.map(row => row.range.max - row.range.min).reduce((val, product) => val * product, 1);
    let solveDisabled = solving || rows.length === 0 || !rows.every(row => row.weight) || desiredSum === 0 || desiredSum === '' || maxError === 0 || maxError === '';
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
              <label>Fragment, Element or Mass (amu)</label>
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

    return (
      <form className="paxl mass-spec-solver">
        <h1>Mass Spec Solver</h1>
        <div className="main-inputs">
          <div className="search form-group row">
            <div className="col-xs-5"></div>
            <Input label="Desired Sum" className="col-xs-9" value={desiredSum} onChange={this.updateDesiredSum}/>
            <Input label="Max Error" className="col-xs-5" value={maxError} onChange={this.updateMaxError}/>
            <div className="col-xs-5"></div>
          </div>
          <div className="buttons mtl row">
            <div className="col-xs-8"></div>
            <HighlightButton onClick={this.solve.bind(this)} type="button" className="mlxl phxxl" disabled={solveDisabled}>{solving ? 'Solving' : 'Solve!'}</HighlightButton>
            <p className="mlxl combinations">{numCombinations} combinations</p>
          </div>
        </div>
        <div className="solutions">
          {solutions &&
            <div className="row">
              <h4>{solutions.length === 1 ? 'There is 1 solution.' : `There are ${solutions.length} solutions.`}</h4>
              <a onClick={this.clearSolutions.bind(this)} className="mlm" href="javascript:void(0)">Clear</a>
              <div className="row">
                <div className="col-md-14">Compound</div>
                <div className="col-md-6">Exact Mass</div>
                <div className="col-md-2">Error</div>
              </div>
              <ul>
                {solutions.map(solution => {
                  return (
                    <li key={solution.params.join('-')} className="row mtm">
                      <div className="col-md-14">
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
                      <div className="col-md-6">
                        {solution.sum.toFixed(4)}
                      </div>
                      <div className="col-md-2">
                        {((1 - solution.sum / desiredSum) * 100).toPrecision(3)}%
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
                <a href="javascript:void(0)" className="action-icon col-xs-2 ptxxl" onClick={this.addRow}>
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

module.exports = Application;
