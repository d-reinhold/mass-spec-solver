const React = require('react');
const PureComponent = require('./pure_component');
const {Icon} = require('pui-react-iconography');
const {Input} = require('pui-react-inputs');
const {Tooltip} = require('pui-react-tooltip');
const {OverlayTrigger} = require('pui-react-overlay-trigger');
const range = require('lodash.range');
const SolveHelper = require('../helpers/solve_helper');
const Actions = require('runtime/actions');

class FragmentRow extends PureComponent {
  updateMaxRange = (i, e) => {
    Actions.updateMaxForRow(i, SolveHelper.parseNumeric(e.target.value));
  };

  updateMinRange = (i, e) => {
    Actions.updateMinForRow(i, SolveHelper.parseNumeric(e.target.value));
  };

  addRow = (e) => {
    e.keyCode === 13 && Actions.addRow();
  };

  updateCoef = (i, e) => {
    const coef = e.target.value;
    Actions.updateCoefAndWeightForRow(i, coef, SolveHelper.computeWeight(coef, this.props.row.charge));
  };

  updateCharge = (i, e) => {
    const charge = parseInt(e.target.value, 10);
    Actions.updateChargeAndWeightForRow(i, charge, SolveHelper.computeWeight(this.props.row.coef, charge));
  };

  render() {
    const {row, rowIndex} = this.props;
    const chargeOptions = range(8, -9).map(charge => {
      const chargeLabel = charge > 0 ? `+${charge}` : charge;
      return <option value={charge} key={charge}>{chargeLabel}</option>;
    });

    return (
      <div className="fragment-row">
        <div className="form-group row">
          <div className="form-group col-xs-13">
            <span className={`weight ${row.weight === null ? 'invalid' : ''}`}>
              {row.weight === null ? <Icon name="question-circle-o" size="h3"/> : row.weight}
            </span>
            <label>Fragment, Element or Mass (g/mol)</label>
            <input className="coef form-control" placeholder="Enter a fragment" value={row.coef} onChange={this.updateCoef.bind(this, rowIndex)} autoFocus={rowIndex===0} onKeyUp={this.addRow}/>
          </div>
          <div className="col-xs-3 form-group charge">
            <label>Charge</label>
            <select className="form-control" value={row.charge} onChange={this.updateCharge.bind(this, rowIndex)}>
              {chargeOptions}
            </select>
          </div>
          <Input label="Min" className="col-xs-3 min" value={row.range.min} onChange={this.updateMinRange.bind(this, rowIndex)}/>
          <Input label="Max" className="col-xs-3 max" value={row.range.max} onChange={this.updateMaxRange.bind(this, rowIndex)}/>
          <a href="javascript:void(0)" className="action-icon col-xs-2 ptxxl" onClick={Actions.removeRow.bind(null, rowIndex)}>
            <OverlayTrigger placement="top" overlay={<Tooltip>Remove this Fragment</Tooltip>}>
              <Icon name="close" size="h3"/>
            </OverlayTrigger>
          </a>
        </div>
      </div>
    );
  }
}

module.exports = FragmentRow;
