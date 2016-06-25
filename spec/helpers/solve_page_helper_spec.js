require('../spec_helper');

let SolveHelper;

describe('SolvePage', () => {
  beforeEach(() => {
    SolveHelper = require('helpers/solve_helper');
  });

  describe('#computeWeight', () => {
    describe('when the coef is an element', () => {
      it('computes the correct molecular weight', () => {
        expect(SolveHelper.computeWeight('C', 7)).toEqual('11.9961598');
        expect(SolveHelper.computeWeight('C', 0)).toEqual('12.0000000');
      });
    });

    describe('when the coef is a molecule', () => {
      it('computes the correct molecular weight', () => {
        expect(SolveHelper.computeWeight('CO2', 7)).toEqual('43.9859898');
        expect(SolveHelper.computeWeight('CO2', 0)).toEqual('43.9898300');
      });
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

  describe('#solveDisabled', () => {
    it('is true if solving is true', () => {
      expect(SolveHelper.solveDisabled(true, [{weight: 5}], 3, 0.02)).toEqual(true);
    });

    it('is true if rows is empty', () => {
      expect(SolveHelper.solveDisabled(false, [], 3, 0.02)).toEqual(true);
    });

    it('is true if there is a row with no weight', () => {
      expect(SolveHelper.solveDisabled(false, [{weight: null}], 3, 0.02)).toEqual(true);
      expect(SolveHelper.solveDisabled(false, [{id: '1'}], 3, 0.02)).toEqual(true);
    });

    it('is true if total mass is zero or not set', () => {
      expect(SolveHelper.solveDisabled(false, [{weight: 5}], 0, 0.02)).toEqual(true);
      expect(SolveHelper.solveDisabled(false, [{weight: 5}], '', 0.02)).toEqual(true);
    });

    it('is true if max error is not set', () => {
      expect(SolveHelper.solveDisabled(false, [{weight: 5}], 3, '')).toEqual(true);
    });

    it('is false if max error is zero', () => {
      expect(SolveHelper.solveDisabled(false, [{weight: 5}], 3, 0)).toEqual(false);
    });

    it('is false if max error is nonzero', () => {
      expect(SolveHelper.solveDisabled(false, [{weight: 5}], 3, 0.02)).toEqual(false);
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
});