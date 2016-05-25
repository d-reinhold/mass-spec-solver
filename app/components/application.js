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
const clone = require('lodash.clone');
const cloneDeep = require('lodash.clonedeep');

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
    id: Math.floor(Math.random() * 1000),
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
      totalMass: urlParams[0] || 0,
      totalCharge: urlParams[1] || '',
      maxError: urlParams[2] || 0.01,
      rows: urlParams[3] || [emptyRow()],
      solutionRows: null,
      solutions: null,
      solving: false
    };
  }

  updateRoute = () => {
    const {totalMass, totalCharge, maxError, rows} = this.state;
    history.pushState(null, null, `?totalMass=${JSON.stringify(totalMass)}&totalCharge=${JSON.stringify(totalCharge)}&maxError=${JSON.stringify(maxError)}&rows=${JSON.stringify(rows)}`);
  };

  solve = () => {
    const {totalMass, maxError, rows} = this.state;
    this.setState({solving: true});
    setTimeout(() => {
      this.setState({
        solutions: SimpleRecursiveKnapsack.solve(rows, parseFloat(totalMass), parseFloat(maxError)),
        solutionRows: cloneDeep(rows),
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
    let newRows = clone(this.state.rows);
    newRows.splice(i, 1);
    this.setState({rows: newRows}, this.updateRoute.bind(this));
  };

  updateTotalMass = (e) => {
    this.setState({totalMass: parseNumeric(e.target.value)}, this.updateRoute.bind(this));
  };

  updateTotalCharge = (e) => {
    this.setState({totalCharge: parseNumeric(e.target.value)}, this.updateRoute.bind(this));
  };

  updateMaxError = (e) => {
    this.setState({maxError: parseNumeric(e.target.value)}, this.updateRoute.bind(this));
  };

  updateCoef = (i, e) => {
    let newRows = clone(this.state.rows);
    newRows[i].coef = e.target.value;
    newRows[i].weight = computeWeight(newRows[i]);
    this.setState({rows: newRows}, this.updateRoute.bind(this));
  };

  updateRange = (i, type, e) => {
    let newRows = clone(this.state.rows);
    newRows[i].range[type] = parseNumeric(e.target.value);
    this.setState({rows: newRows}, this.updateRoute.bind(this));
  };

  updateCharge = (i, e) => {
    let newRows = clone(this.state.rows);
    newRows[i].charge = parseInt(e.target.value, 10);
    newRows[i].weight = computeWeight(newRows[i]);
    this.setState({rows: newRows}, this.updateRoute.bind(this));
  };

  clearSolutions = () => {
    this.setState({solutions: null});
  };

  render() {
    const {totalMass, totalCharge, maxError, rows, solutions, solutionRows, solving} = this.state;
    const numCombinations = rows.map(row => row.range.max - row.range.min).reduce((val, product) => val * product, 1);
    let solveDisabled = solving || rows.length === 0 || !rows.every(row => row.weight) || totalMass === 0 || totalMass === '' || maxError === 0 || maxError === '';
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
      <form className="paxl mass-spec-solver">
        <h1>Mass Spec Solver</h1>
        <div className="main-inputs">
          <div className="search form-group row">
            <Input label="Total Mass" className="col-xs-8" value={totalMass} onChange={this.updateTotalMass}/>
            <Input label="Total Charge (optional)" className="col-xs-8" value={totalCharge} onChange={this.updateTotalCharge}/>
            <Input label="Max Error" className="col-xs-8" value={maxError} onChange={this.updateMaxError}/>
          </div>
          <div className="buttons mtl row">
            <div className="col-xs-8"></div>
            <HighlightButton onClick={this.solve.bind(this)} type="button" className="mlxl phxxl" disabled={solveDisabled}>{solving ? 'Solving' : 'Solve!'}</HighlightButton>
            <p className="mlxl combinations">{numCombinations} combinations</p>
          </div>
        </div>
        <div className="solutions">
          {validSolutions &&
            <div className="row">
              <h4>{validSolutions.length === 1 ? 'There is 1 solution.' : `There are ${validSolutions.length} solutions.`}</h4>
              <a onClick={this.clearSolutions.bind(this)} className="mlm" href="javascript:void(0)">Clear</a>
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
