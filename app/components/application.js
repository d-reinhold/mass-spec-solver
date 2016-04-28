const React = require('react');
const {Icon} = require('pui-react-iconography');
const {Input} = require('pui-react-inputs');
const {HighlightButton} = require('pui-react-buttons');
const SimpleRecursiveKnapsack = require('algorithms/simple_recursive_knapsack');
const range = require('lodash.range');

class Application extends React.Component {
  constructor(props, context) {
    super(props, context);
    const urlParams = location.search.slice(1).split('&').map(val => val && JSON.parse(decodeURIComponent(val.split('=')[1]) || '""'));
    this.state = {
      coefs: urlParams[0] || [],
      ranges: urlParams[1] || [],
      desiredSum: urlParams[2] || 0,
      maxError: urlParams[3] || 2000,
      charges: urlParams[4] || [],
      solutions: [],
      saving: false
    };
  }

  updateRoute = () => {
    const {coefs, ranges, desiredSum, maxError, charges} = this.state;
    history.pushState(null, null, `?coefs=${JSON.stringify(coefs)}&ranges=${JSON.stringify(ranges)}&desiredSum=${desiredSum}&maxError=${maxError}&charges=${JSON.stringify(charges)}`);
  };

  solve = () => {
    const {coefs, ranges, charges, desiredSum, maxError} = this.state;
    this.setState({saving: true});
    const solutions = SimpleRecursiveKnapsack.solve(coefs, ranges, charges, desiredSum, maxError);
    console.log('There were ' + solutions.length + ' solutions:');
    console.log(solutions.map(s => s.params + ' ' + s.sum));
    this.setState({solutions});
    console.log('maxError', maxError);
    this.setState({saving: false});
  };

  addCoeff = () => {
    const {coefs, ranges, charges} = this.state;
    this.setState({
      coefs: coefs.concat(''),
      ranges: ranges.concat([[0, 5]]),
      charges: charges.concat([0])
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
    newcoefs[i] = e.target.value;
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

  render() {
    const {coefs, ranges, desiredSum, solutions, saving, charges} = this.state;
    const numCombinations = ranges.map(([min, max]) => max - min).reduce((val, product) => val * product, 1);
    const coeffInputs = coefs.map((c, i) => {
      const [min, max] = ranges[i];
      const chargeOptions = range(8, -9).map(charge => {
        const chargeLabel = charge > 0 ? `+${charge}` : charge;
        return <option value={charge} key={charge}>{chargeLabel}</option>;
      });
      return (
        <div className="form-group row" key={i}>
          <Input label="Fragment" className="col-xs-8" placeholder="Enter a fragment" value={c} onChange={this.updateCoeff.bind(this, i)}/>
          <div className="col-xs-3 form-group">
            <label>Charge</label>
            <select className="form-control" value={charges[i]} onChange={this.updateCharge.bind(this, i)}>
              {chargeOptions}
            </select>
          </div>
          <Input label="Min" className="col-xs-5" value={min} onChange={this.updateRange.bind(this, i, 0)}/>
          <Input label="Max" className="col-xs-5" value={max} onChange={this.updateRange.bind(this, i, 1)}/>
          <a href="javascript:void(0)" className="col-xs-2 ptxxl" onClick={this.removeCoeff.bind(this, i)}><Icon name="close"/></a>
        </div>
      );
    });

    return (
      <form className="paxl">
        {coeffInputs}
        <div className="form-group row mtxl">
          <div className="col-xs-6">
            <Input label="Desired Sum" className="row" value={desiredSum} onChange={this.updateDesiredSum}/>
            <div className="mtl row">
              <HighlightButton onClick={this.addCoeff.bind(this)} type="button">Add a Fragment</HighlightButton>
              <HighlightButton onClick={this.solve.bind(this)} type="button" className="mlm" disabled={saving}>Solve!</HighlightButton>
            </div>
          </div>
          <p className="col-xs-18 ptxxl txt-c">There are {numCombinations} combinations.</p>
        </div>
        {solutions.length > 0 &&
          <div className="row">
            <h2>Solutions</h2>
            <h4>{solutions.length === 1 ? 'There is 1 solution.' : `There are ${solutions.length} solutions.`}</h4>
            <ul>
              {solutions.map((solution, i) => (
                <li key={i}>{JSON.stringify(solution.params) + '. sum:' + solution.sum + '. Diff: ' + (Math.abs(solution.sum - desiredSum))}</li>
              ))}
            </ul>
          </div>
        }
      </form>
    );
  }
}

module.exports = Application;
