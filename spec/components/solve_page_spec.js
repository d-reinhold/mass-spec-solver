require('../spec_helper');

let SolvePage, Actions, SolveHelper, Solutions, FragmentRow, Knapsack, props, solveSpy;

describe('SolvePage', () => {
  beforeEach(() => {
    SolvePage = require('components/solve_page');
    Actions = require('runtime/actions');
    SolveHelper = require('helpers/solve_helper');
    Solutions = require('components/solutions');
    FragmentRow = require('components/fragment_row');
    Knapsack = require('algorithms/knapsack');
    spyOn(Actions, 'updateSolving');
    spyOn(Actions, 'updateSolutions');
    spyOn(Actions, 'updateTotalMass');
    spyOn(Actions, 'updateTotalCharge');
    spyOn(Actions, 'updateMaxError');
    spyOn(Actions, 'addRow');
    spyOn(SolveHelper, 'solveDisabled').and.returnValue(false);
    spyOn(SolveHelper, 'numCombinations').and.returnValue(47);
    spyOn(SolveHelper, 'formatRows').and.returnValue('some-formatted-rows');
    solveSpy = spyOnAsync(Knapsack, 'solve');
    spyOnRender(Solutions);
    spyOnRender(FragmentRow);
    props = {
      totalMass: '500.32',
      totalCharge: '2',
      maxError: '0.02',
      rows: [{id: 0}, {id: 1}, {id: 2}],
      strategy: {},
      solutions: [],
      solutionRows: [],
      solving: false
    };
    ReactDOM.render(<SolvePage {...props}/>, root);
  });

  it('renders the Solutions component', () => {
    expect(Solutions).toHaveBeenRenderedWithProps({totalCharge: props.totalCharge, solutions: props.solutions, solutionRows: props.solutionRows});
  });

  it('renders a FragmentRow component for each row', () => {
    expect(FragmentRow.prototype.render.calls.count()).toEqual(3);
  });

  it('correctly renders the solve button', () => {
    expect(SolveHelper.solveDisabled).toHaveBeenCalledWith(props.solving, props.rows, props.totalMass, props.maxError);
    expect('.num-combinations').toHaveText('47 combinations to search.');
  });

  it('renders the corrent number of combinations', () => {
    expect(SolveHelper.numCombinations).toHaveBeenCalledWith(props.rows);
    expect('.solve-page button:contains(Solve!)').not.toBeDisabled();
  });

  describe('main inputs', () => {
    it('renders the current state into the form', () => {
      expect('.main-inputs .total-mass input').toHaveValue('500.32');
      expect('.main-inputs .total-charge input').toHaveValue('2');
      expect('.main-inputs .max-error input').toHaveValue('0.02');
    });

    describe('changing the total mass', () => {
      it('calls the updateTotalMass action', () => {
        $('.main-inputs .total-mass input').simulate('changeValue', '539.34');
        expect(Actions.updateTotalMass).toHaveBeenCalledWith('539.34');
      });
    });
    
    describe('changing the total charge', () => {
      it('calls the updateTotalCharge action', () => {
        $('.main-inputs .total-charge input').simulate('changeValue', '3');
        expect(Actions.updateTotalCharge).toHaveBeenCalledWith('3');
      });
    });

    describe('changing the max error', () => {
      it('calls the updateMaxError action', () => {
        $('.main-inputs .max-error input').simulate('changeValue', '0.01');
        expect(Actions.updateMaxError).toHaveBeenCalledWith('0.01');
      });
    });
  });

  describe('adding a row', () => {
    it('calls the addRow action', () => {
      $('.fragment-row .action-icon').simulate('click');
      expect(Actions.addRow).toHaveBeenCalled();
    });
  });

  describe('clicking solve', () => {
    beforeEach(() => {
      $('.main-inputs button:contains(Solve!)').simulate('click');
    });

    it('sets solving to true', () => {
      expect(Actions.updateSolving).toHaveBeenCalledWith(true);
    });

    it('calls the solve method on the Knapsack module with the formatted data', () => {
      expect(SolveHelper.formatRows).toHaveBeenCalledWith(props.rows);
      expect(Knapsack.solve).toHaveBeenCalledWith(props.strategy, 'some-formatted-rows', 500.32, 0.02);
    });

    describe('when the solve request succeeds', () => {
      beforeEach(() => {
        solveSpy.resolve('some-solutions');
      });

      it('calls the updateSolutions action with the solutions and rows', () => {
        expect(Actions.updateSolutions).toHaveBeenCalledWith('some-solutions', props.rows);
      });

      it('sets solving to false', () => {
        expect(Actions.updateSolving).toHaveBeenCalledWith(false);
      });
    });

    describe('when the solve request fails', () => {
      beforeEach(() => {
        solveSpy.reject(new Error('some-error'));
        MockPromises.tick(10);
      });

      it('does not call the updateSolutions action', () => {
        expect(Actions.updateSolutions).not.toHaveBeenCalled();
      });

      it('sets solving to false', () => {
        expect(Actions.updateSolving).toHaveBeenCalledWith(false);
      });
    });
  });
});