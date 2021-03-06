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
    Object.entries(state).forEach(([key, value]) => {
      Store.cursor.refine(key).set(value);
    });
  },
  updateSolving(solvingState) {
    Store.cursor.refine('solving').set(solvingState);
  },
  updateSolutions(solutionSums, rows, totalMass) {
    Store.cursor.refine('solutions').set({solutionSums, rows, totalMass});
  },
  addRow() {
    Store.cursor.refine('rows').unshift(emptyRow());
  },
  removeRow(i) {
    if (Store.cursor.refine('rows').get().length > 1) {
      Store.cursor.refine('rows').splice([i, 1]);
    } else {
      Store.cursor.refine('rows').set([emptyRow()]);
    }
  },
  clearAll() {
    Store.cursor.refine('rows').set([emptyRow()]);
    Store.cursor.refine('solutions').set(null);
    Store.cursor.refine('activeTemplateName').set(null);
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
  },
  openModal(modalProps) {
    Store.cursor.refine('modal').set({...{open: true, data: {}}, ...modalProps});
  },
  closeModal() {
    Store.cursor.refine('modal').set({open: false, data: {}});
  },
  saveAsTemplate() {
    const {totalMass, totalCharge, maxError, rows} = Store.cursor.get();
    const newTemplateName = Store.cursor.refine('modal', 'data', 'newTemplateName').get() || Store.cursor.refine('activeTemplateName').get();
    let templates = JSON.parse(window.localStorage.getItem('mss-templates') || '{}');
    templates[newTemplateName] = {totalMass, totalCharge, maxError, rows};
    window.localStorage.setItem('mss-templates', JSON.stringify(templates));
    Store.cursor.refine('templates').set(templates);
    Actions.closeModal();
  },
  removeTemplate(templateName) {
    Store.cursor.refine('templates').remove(templateName);
    Store.cursor.flush();
    window.localStorage.setItem('mss-templates', JSON.stringify(Store.cursor.refine('templates').get()));
  },
  updateNewTemplateName(e) {
    Store.cursor.refine('modal', 'data', 'newTemplateName').set(e.target.value);
    Store.cursor.refine('activeTemplateName').set(null);
  }
};

module.exports = Actions;