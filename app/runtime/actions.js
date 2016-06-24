const Store = require('./store');
const {emptyRow} = require('helpers/solve_helper');

const Actions = {
  navigate(page) {
    Store.cursor.refine('page').set(page);
  },
  updateOffline(offlineState) {
    Store.cursor.refine('strategy', 'offline').set(offlineState);
  },
  updateAlgorithm(algorithm) {
    Store.cursor.refine('strategy', 'algorithm').set(algorithm);
  },
  resetState(state) {
    Store.cursor.set(state);
  },
  updateSolving(solvingState) {
    Store.cursor.refine('solving').set(solvingState);
  },
  updateSolutions(solutions, solutionRows) {
    Store.cursor.refine('solutions').set(solutions);
    Store.cursor.refine('solutionRows').set(solutionRows);
  },
  addRow() {
    Store.cursor.refine('rows').unshift(emptyRow());
  },
  removeRow(i) {
    Store.cursor.refine('rows').splice([i, 1]);
  },
  updateTotalMass(totalMass) {
    Store.cursor.refine('totalMass').set(totalMass);
  },
  updateTotalCharge(totalCharge) {
    Store.cursor.refine('totalCharge').set(totalCharge);
  },
  updateMaxError(maxError) {
    Store.cursor.refine('maxError').set(maxError);
  },
  updateCoefAndWeightForRow(rowIndex, coef, weight) {
    Store.cursor.refine('rows', rowIndex, 'coef').set(coef);
    Store.cursor.refine('rows', rowIndex, 'weight').set(weight);
  },
  updateChargeAndWeightForRow(rowIndex, charge, weight) {
    Store.cursor.refine('rows', rowIndex, 'charge').set(charge);
    Store.cursor.refine('rows', rowIndex, 'weight').set(weight);
  },
  updateMaxForRow(rowIndex, max) {
    Store.cursor.refine('rows', rowIndex, 'range', 'max').set(max);
  },
  updateMinForRow(rowIndex, min) {
    Store.cursor.refine('rows', rowIndex, 'range', 'min').set(min);
  },
  clearSolutions() {
    Store.cursor.refine('solutions').set(null);
    Store.cursor.refine('solutionRows').set(null);
  }
};

module.exports = Actions;