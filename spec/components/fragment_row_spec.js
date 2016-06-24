require('../spec_helper');

let FragmentRow, Actions, SolveHelper, row;

describe('FragmentRow', () => {
  beforeEach(() => {
    FragmentRow = require('components/fragment_row');
    Actions = require('runtime/actions');
    SolveHelper = require('helpers/solve_helper');
    spyOn(Actions, 'updateMaxForRow');
    spyOn(Actions, 'updateMinForRow');
    spyOn(Actions, 'updateCoefAndWeightForRow');
    spyOn(Actions, 'updateChargeAndWeightForRow');
    spyOn(Actions, 'removeRow');
    spyOn(SolveHelper, 'computeWeight');

    row = {coef: 'CO2', charge: 2, weight: 43.9898300, range: {min: 0, max: 5}};
  });

  describe('the coef of the fragment', () => {
    beforeEach(() => {
      ReactDOM.render(<FragmentRow rowIndex={47} row={row}/>, root);
    });

    it('shows the coef', () => {
      expect('.fragment-row input.coef').toHaveValue('CO2');
    });

    describe('changing the coef', () => {
      it('invokes the updateCoefAndWeightForRow action with the right parameters', () => {
        SolveHelper.computeWeight.and.returnValue('some-weight');
        $('.fragment-row input.coef').simulate('change', {target: {value: 'H2O'}});

        expect(SolveHelper.computeWeight).toHaveBeenCalledWith('H2O', 2);
        expect(Actions.updateCoefAndWeightForRow).toHaveBeenCalledWith(47, 'H2O', 'some-weight');
      });
    });
  });

  describe('the weight of the fragment', () => {
    describe('when the weight of the fragment is valid', () => {
      it('shows the weight', () => {
        ReactDOM.render(<FragmentRow rowIndex={47} row={row}/>, root);

        expect('.fragment-row .weight.invalid').not.toExist();
        expect('.fragment-row .weight').toContainText(43.9898300);
      });
    });

    describe('when the weight of the row is invalid', () => {
      it('indicates the weight is invalid', () => {
        row.weight = null;
        ReactDOM.render(<FragmentRow rowIndex={47} row={row}/>, root);

        expect('.fragment-row .weight.invalid .fa-question-circle-o').toExist();
      });
    });
  });

  describe('the charge of the fragment', () => {
    beforeEach(() => {
      ReactDOM.render(<FragmentRow rowIndex={47} row={row}/>, root);
    });

    it('shows the charge', () => {
      expect('.fragment-row .charge select option').toHaveLength(17); // from -8 to 8
      expect('.fragment-row .charge select').toHaveValue(2);
    });

    describe('changing the charge', () => {
      it('invokes the updateChargeAndWeightForRow action with the right parameters', () => {
        SolveHelper.computeWeight.and.returnValue('some-weight');
        $('.fragment-row .charge select').simulate('select', -2);

        expect(SolveHelper.computeWeight).toHaveBeenCalledWith('CO2', -2);
        expect(Actions.updateChargeAndWeightForRow).toHaveBeenCalledWith(47, -2, 'some-weight');
      });
    });
  });

  describe('the range of the fragment', () => {
    beforeEach(() => {
      ReactDOM.render(<FragmentRow rowIndex={47} row={row}/>, root);
    });

    it('shows the range', () => {
      expect('.fragment-row .min input').toHaveValue('0');
      expect('.fragment-row .max input').toHaveValue('5');
    });

    describe('changing the min', () => {
      it('invokes the updateMinForRow action with the right parameters', () => {
        $('.fragment-row .min input').simulate('change', {target: {value: '2'}});
        expect(Actions.updateMinForRow).toHaveBeenCalledWith(47, '2');
      });
    });

    describe('changing the max', () => {
      it('invokes the updateMaxForRow action with the right parameters', () => {
        $('.fragment-row .max input').simulate('change', {target: {value: '10'}});
        expect(Actions.updateMaxForRow).toHaveBeenCalledWith(47, '10');
      });
    });
  });
});

