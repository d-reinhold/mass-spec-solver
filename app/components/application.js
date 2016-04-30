const React = require('react');
const {Icon} = require('pui-react-iconography');
const {Input} = require('pui-react-inputs');
const {HighlightButton} = require('pui-react-buttons');
const SimpleRecursiveKnapsack = require('algorithms/simple_recursive_knapsack');
const VelocityTransitionGroup = require('helpers/velocity_transition_group');
const range = require('lodash.range');


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
      solutions: [],
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
      const solutions = SimpleRecursiveKnapsack.solve(coefs.map(c => c.value), ranges, charges, parseFloat(desiredSum, 10), parseFloat(maxError, 0));
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

  render() {
    const {coefs, ranges, desiredSum, maxError, solutions, solving, charges} = this.state;
    const numCombinations = ranges.map(([min, max]) => max - min).reduce((val, product) => val * product, 1);
    let coeffInputs = coefs.map((c, i) => {
      const [min, max] = ranges[i];
      const chargeOptions = range(8, -9).map(charge => {
        const chargeLabel = charge > 0 ? `+${charge}` : charge;
        return <option value={charge} key={charge}>{chargeLabel}</option>;
      });
      let actionIcon, actionIconProps = {href: 'javascript:void(0)', className: 'action-icon col-xs-2 ptxxl'};
      if (i === 0 && coefs.every(c => c.value)) {
        actionIconProps.onClick = this.addCoeff.bind(this, i);
        actionIcon = <a {...actionIconProps}><Icon name="plus-circle" size="h3"/></a>;
      } else {
        actionIcon = <a {...actionIconProps} onClick={this.removeCoeff.bind(this, i)}><Icon name="close" size="h3"/></a>;
      }
      return (
        <div className="fragment" key={c.id}>
          <div className="form-group row">
            <Input label="Fragment, Element or Mass (amu)" className="col-xs-10" placeholder="Enter a fragment" value={c.value} onChange={this.updateCoeff.bind(this, i)} autoFocus={i===0}/>
            <div className="col-xs-4 form-group">
              <label>Charge</label>
              <select className="form-control" value={charges[i]} onChange={this.updateCharge.bind(this, i)}>
                {chargeOptions}
              </select>
            </div>
            <Input label="Min" className="col-xs-4" value={min} onChange={this.updateRange.bind(this, i, 0)}/>
            <Input label="Max" className="col-xs-4" value={max} onChange={this.updateRange.bind(this, i, 1)}/>
            {actionIcon}
          </div>
        </div>
      );
    });

    return (
      <form className="paxl chemsack-app">
        <h1>Mass Spec Solutions</h1>
        <div className="main-inputs">
          <div className="search form-group row">
            <div className="col-xs-5"></div>
            <Input label="Desired Sum" className="col-xs-9" value={desiredSum} onChange={this.updateDesiredSum}/>
            <Input label="Max Error" className="col-xs-5" value={maxError} onChange={this.updateMaxError}/>
            <div className="col-xs-5"></div>
          </div>
          <div className="buttons mvl row">
            <div className="col-xs-8"></div>
            <HighlightButton onClick={this.solve.bind(this)} type="button" className="mlxl phxxl" disabled={solving}>{solving ? 'Solving' : 'Solve!'}</HighlightButton>
            <p className="mlxl combinations">{numCombinations} combinations</p>
          </div>
        </div>
        <div className="solutions">
          {solutions.length > 0 &&
            <div className="row">
              <h2>Solutions</h2>
              <h4>{solutions.length === 1 ? 'There is 1 solution.' : `There are ${solutions.length} solutions.`}</h4>
              <ul>
                {solutions.map((solution, i) => (
                  <li key={i}>
                    <label>Coefficients:</label>
                    <ul>{solution.params.map((param, j) => <li key={param}>{`${param}${coefs[j]}`}</li>)}</ul>
                    <label>Sum:</label>
                    <span>{solution.sum}</span>
                    <label>Diff:</label>
                    <span>{Math.abs(solution.sum - desiredSum)}</span>
                  </li>
                ))}
              </ul>
            </div>
          }
        </div>
        <div className="fragments">
          <VelocityTransitionGroup transitionName="slide-forward" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
            {coeffInputs}
          </VelocityTransitionGroup>
        </div>
      </form>
    );
  }
}

module.exports = Application;
