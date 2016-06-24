const React = require('react');
const VelocityTransitionGroup = require('helpers/velocity_transition_group');
const Knapsack = require('algorithms/knapsack');
const {Icon} = require('pui-react-iconography');
const {Input} = require('pui-react-inputs');
const {HighlightButton} = require('pui-react-buttons');
const {Tooltip} = require('pui-react-tooltip');
const {OverlayTrigger} = require('pui-react-overlay-trigger');
const Solutions = require('./solutions');
const FragmentRow = require('./fragment_row');
const cloneDeep = require('lodash.clonedeep');
const SolveHelper = require('../helpers/solve_helper');
const Actions = require('runtime/actions');

class SolvePage extends React.Component {
  solve = () => {
    const {totalMass, maxError, rows, strategy} = this.props;
    Actions.updateSolving(true);
    Knapsack.solve(strategy, SolveHelper.formatRows(rows), parseFloat(totalMass), parseFloat(maxError))
    .then((solutions) => {
      Actions.updateSolutions(solutions, cloneDeep(rows));
      Actions.updateSolving(false);
    }).catch(() => {
      Actions.updateSolving(false);
    });
  };

  updateTotalMass = (e) => {
    Actions.updateTotalMass(SolveHelper.parseNumeric(e.target.value));
  };

  updateTotalCharge = (e) => {
    Actions.updateTotalCharge(SolveHelper.parseNumeric(e.target.value));
  };

  updateMaxError = (e) => {
    Actions.updateMaxError(SolveHelper.parseNumeric(e.target.value));
  };

  render() {
    const {totalMass, totalCharge, maxError, rows, solutions, solutionRows, solving} = this.props;

    return (
      <form className="solve-page">
        <div className="main-inputs">
          <div className="search form-group row">
            <Input label="Total Mass" className="total-mass col-xs-8" value={totalMass} onChange={this.updateTotalMass}/>
            <Input label="Total Charge (optional)" className="total-charge col-xs-8" value={totalCharge} onChange={this.updateTotalCharge}/>
            <Input label="Max Error" className="col-xs-8 max-error" value={maxError} onChange={this.updateMaxError}/>
          </div>
          <div>
            <HighlightButton onClick={this.solve} type="button" className="phxxl" disabled={SolveHelper.solveDisabled(solving, rows, totalMass, maxError)}>
              {solving ? 'Solving' : 'Solve!'}
            </HighlightButton>
          </div>
          <span className="num-combinations">{`${SolveHelper.numCombinations(rows)} combinations to search.`}</span>
        </div>
        <Solutions {...{totalCharge, solutions, solutionRows}}/>
        <div className="fragments">
          <VelocityTransitionGroup transitionName="slide-forward" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
            <div className="fragment-row" key="9999">
              <div className="row">
                <div className="col-xs-22"></div>
                <a href="javascript:void(0)" className="action-icon col-xs-2 ptm" onClick={Actions.addRow}>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Add a Fragment</Tooltip>}>
                    <Icon name="plus-circle" size="h3"/>
                  </OverlayTrigger>
                </a>
              </div>
            </div>
            {rows.map((row, rowIndex) => <FragmentRow {...{row, rowIndex, key: row.id}}/>)}
          </VelocityTransitionGroup>
        </div>
      </form>
    );
  }
}

module.exports = SolvePage;
