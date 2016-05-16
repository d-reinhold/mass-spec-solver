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


function normalizeCoef(fragment, charge) {
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
  return charge ? weight - ElementalMassHelper.electron * charge : weight;
}


class Application extends React.Component {
  constructor(props, context) {
    super(props, context);
    const urlParams = location.search.slice(1).split('&').map(val => val && JSON.parse(decodeURIComponent(val.split('=')[1]) || '""'));
    this.state = {
      coefs: urlParams[0] || [{id: 0, value: ''}],
      ranges: urlParams[1] || [[0, 5]],
      charges: urlParams[4] || [0],
      desiredSum: urlParams[2] || '0',
      maxError: urlParams[3] || '.01',
      solutions: null,
      solving: false
    };
  }

  updateRoute = () => {
    const {coefs, ranges, desiredSum, maxError, charges} = this.state;
    history.pushState(null, null, `?coefs=${JSON.stringify(coefs)}&ranges=${JSON.stringify(ranges)}&desiredSum=${desiredSum}&maxError=${JSON.stringify(maxError)}&charges=${JSON.stringify(charges)}`);
  };

  solve = () => {
    const {coefs, ranges, charges, desiredSum, maxError} = this.state;
    this.setState({solving: true});
    setTimeout(() => {
      const solutions = SimpleRecursiveKnapsack.solve(coefs.map((c, i) => normalizeCoef(c.value, charges[i])), ranges, parseFloat(desiredSum, 10), parseFloat(maxError, 0));
      this.setState({solutions, solving: false});
    });
  };

  addCoeff = () => {
    const {coefs, ranges, charges} = this.state;
    this.setState({
      coefs: [{id: Math.random(), value: ''}].concat(coefs),
      ranges: [[0, 5]].concat(ranges),
      charges: [0].concat(charges)
    }, this.updateRoute.bind(this));
  };

  removeCoeff = (i) => {
    let newcoefs = this.state.coefs.slice(0);
    let newRanges = this.state.ranges.slice(0);
    let newCharges = this.state.charges.slice(0);
    newcoefs.splice(i, 1);
    newRanges.splice(i, 1);
    newCharges.splice(i, 1);
    this.setState({coefs: newcoefs, ranges: newRanges, charges: newCharges}, this.updateRoute.bind(this));
  };

  updateDesiredSum = (e) => {
    this.setState({desiredSum: e.target.value}, this.updateRoute.bind(this));
  };

  updateCoeff = (i, e) => {
    let newcoefs = this.state.coefs.slice(0);
    newcoefs[i].value = e.target.value;
    this.setState({coefs: newcoefs}, this.updateRoute.bind(this));
  };

  updateRange = (i, type, e) => {
    let newRanges = this.state.ranges.slice(0);
    newRanges[i][type] = e.target.value;
    this.setState({ranges: newRanges}, this.updateRoute.bind(this));
  };

  updateCharge = (i, e) => {
    let newCharges = this.state.charges.slice(0);
    newCharges[i] = e.target.value;
    this.setState({charges: newCharges}, this.updateRoute.bind(this));
  };

  updateMaxError = (e) => {
    this.setState({maxError: e.target.value}, this.updateRoute.bind(this));
  };

  clearSolutions = () => {
    this.setState({solutions: null});
  };

  render() {
    const {coefs, ranges, desiredSum, maxError, solutions, solving, charges} = this.state;
    const numCombinations = ranges.map(([min, max]) => max - min).reduce((val, product) => val * product, 1);
    let coeffInputs = coefs.map((c, i) => {
      const weight = normalizeCoef(c.value, charges[i]).toPrecision(9);
      const [min, max] = ranges[i];
      const chargeOptions = range(8, -9).map(charge => {
        const chargeLabel = charge > 0 ? `+${charge}` : charge;
        return <option value={charge} key={charge}>{chargeLabel}</option>;
      });

      return (
        <div className="fragment" key={c.id}>
          <div className="form-group row">
            <div className="form-group col-xs-13">
              <span className={`shadow-text ${isNaN(weight) || parseInt(weight,10) === 0 ? 'invalid' : ''}`}>{weight}</span>
              <label>Fragment, Element or Mass (amu)</label>
              <input className="form-control" placeholder="Enter a fragment" value={c.value} onChange={this.updateCoeff.bind(this, i)} autoFocus={i===0}/>
            </div>
            <div className="col-xs-3 form-group">
              <label>Charge</label>
              <select className="form-control" value={charges[i]} onChange={this.updateCharge.bind(this, i)}>
                {chargeOptions}
              </select>
            </div>
            <Input label="Min" className="col-xs-3" value={min} onChange={this.updateRange.bind(this, i, 0)}/>
            <Input label="Max" className="col-xs-3" value={max} onChange={this.updateRange.bind(this, i, 1)}/>
            <a href="javascript:void(0)" className="action-icon col-xs-2 ptxxl" onClick={this.removeCoeff.bind(this, i)}>
              <OverlayTrigger placement="top" overlay={<Tooltip>Remove this Fragment</Tooltip>}>
                <Icon name="close" size="h3"/>
              </OverlayTrigger>
            </a>
          </div>
        </div>
      );
    });

    const solveDisabled = solving || !coefs.every(c => c.value) || parseInt(desiredSum, 10) === 0;

    return (
      <form className="paxl chemsack-app">
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
                {solutions.sort(s => Math.abs(s.sum - desiredSum)).map(solution => {
                  return (
                    <li key={solution.sum} className="row mtm">
                      <div className="col-md-14">
                        {
                          solution.params
                            .filter(param => param)
                            .map((param, j) => {
                               const formula = coefs[j].value.split('').map((char, charIndex) => {
                                 return isFinite(char) ? <sub key={charIndex}>{char}</sub> : <span key={charIndex}>{char}</span>;
                               });
                               return <span className="mlxs" key={coefs[j].value}>({formula})<sub>{param}</sub></span>;
                             })
                        }
                      </div>
                      <div className="col-md-6">
                        {solution.sum}
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
                <a href="javascript:void(0)" className="action-icon col-xs-2 ptxxl" onClick={this.addCoeff}>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Add a Fragment</Tooltip>}>
                    <Icon name="plus-circle" size="h3"/>
                  </OverlayTrigger>
                </a>
              </div>
            </div>
            {coeffInputs}
          </VelocityTransitionGroup>
        </div>
      </form>
    );
  }
}

module.exports = Application;
