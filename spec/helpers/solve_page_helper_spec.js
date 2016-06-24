require('../spec_helper');

let SolveHelper;

describe('SolvePage', () => {
  beforeEach(() => {
    SolveHelper = require('helpers/solve_helper');
  });

  describe('#formatRows', () => {
    it('parses string data into floats and ints', () => {
      expect(SolveHelper.formatRows([
        {weight: '350.54435', range: {min: '2', max: '6'}},
        {weight: '234.23', range: {min: '0', max: '3.2'}},
        {weight: '47', range: {min: '0', max: '4'}},
        {weight: '12.34', range: {min: '1', max: '10'}}
      ])).toEqual([
        {weight: 350.54435, range: {min: 2, max: 6}},
        {weight: 234.23, range: {min: 0, max: 3}},
        {weight: 47, range: {min: 0, max: 4}},
        {weight: 12.34, range: {min: 1, max: 10}}
      ]);
    });
  });

  describe('#numCombinations', () => {
    it('calculates the max number of combinations of elements (not considering the target weight)', () => {
      expect(SolveHelper.numCombinations([
        {weight: '350.54435', range: {min: '2', max: '6'}},
        {weight: '234.23', range: {min: '0', max: '3.2'}},
        {weight: '47', range: {min: '0', max: '4'}},
        {weight: '12.34', range: {min: '1', max: '10'}}
      ])).toEqual(1000);
    });
  });

  describe('#parseNumeric', () => {
    it('strips nonnumeric characters from strings (but leaves them as strings)', () => {
      expect(SolveHelper.parseNumeric('123')).toEqual('123');
      expect(SolveHelper.parseNumeric('-123')).toEqual('-123');
      expect(SolveHelper.parseNumeric('a12b3c')).toEqual('123');
      expect(SolveHelper.parseNumeric('1.23')).toEqual('1.23');
    });
  });
});