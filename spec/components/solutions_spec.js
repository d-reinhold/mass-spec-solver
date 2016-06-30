require('../spec_helper');

let Solutions, props;

describe('Solutions', () => {
  beforeEach(() => {
    Solutions = require('components/solutions');
    props = {
      solutions: {
        totalMass: 171.0539,
        rows: [{coef: 'N', charge: 1}, {coef: 'O', charge: 0}, {coef: 'H', charge: 0}, {coef: 'C', charge: 0}],
        solutionSums: [{
          sum: 171.04914389,
          params: [3, 6, 9, 2]
        }, {
          sum: 171.05463452,
          params: [0, 2, 7, 11]
        }]
      }
    };
  });

  describe('when the total charge is not set', () => {
    it('renders the solutions in the correct order', () => {
      props.totalCharge = '';
      ReactDOM.render(<Solutions {...props}/>, root);

      expect('.solutions .solution').toHaveLength(2);

      expect('.solutions .solution:nth-child(1)').toContainText('(N)3(O)6(H)9(C)2');
      expect('.solutions .solution:nth-child(1').toContainText('171.0491');
      expect('.solutions .solution:nth-child(1)').toContainText('0.0048');

      expect('.solutions .solution:nth-child(2)').toContainText('(O)2(H)7(C)11');
      expect('.solutions .solution:nth-child(2)').toContainText('171.0546');
      expect('.solutions .solution:nth-child(2)').toContainText('0.0007');
    });
  });

  describe('when the total charge is set', () => {
    it('filters out solutions with the wrong charge', () => {
      props.totalCharge = '3';
      ReactDOM.render(<Solutions {...props}/>, root);

      expect('.solutions .solution').toHaveLength(1);
      expect('.solutions .solution:nth-child(1)').toContainText('(N)3(O)6(H)9(C)2');
    });
  });
});