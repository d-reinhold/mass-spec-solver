require('../spec_helper');

let Formula;

describe('Formula', () => {
  beforeEach(() => {
    Formula = require('components/formula');
  });

  describe('a simple formula', () => {
    beforeEach(() => {
      ReactDOM.render(<Formula count="2" fragment="NaCl"/>, root);
    });

    it('renders the correct output', () => {
      expect('.formula').toContainText('(NaCl)2');
    });

    it('renders the count in a sub tag', () => {
      expect('.formula sub').toHaveText('2');
    });
  });

  describe('a complex formula', () => {
    beforeEach(() => {
      ReactDOM.render(<Formula count="34" fragment="C6H12O6"/>, root);
    });

    it('renders the correct output', () => {
      expect('.formula').toContainText('(C6H12O6)34');
    });

    it('renders all numbers inside sub tags', () => {
      expect('.formula sub:contains(6)').toExist();
      expect('.formula sub:contains(1)').toExist();
      expect('.formula sub:contains(2)').toExist();
      expect('.formula sub:contains(3)').toExist();
      expect('.formula sub:contains(4)').toExist();
    });
  });
});