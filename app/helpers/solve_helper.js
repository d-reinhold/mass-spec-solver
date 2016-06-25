const ElementalMassHelper = require('helpers/elemental_mass_helper');

const SolveHelper = {
  emptyRow() {
    return {
      id: Math.floor(Math.random() * 1000),
      coef: '',
      range: {min: 0, max: 5},
      charge: 0,
      weight: null
    };
  },

  computeWeight(coef, charge) {
    let weight = ElementalMassHelper.fragments[coef];
    if (!weight) {
      if (coef.match(/(\d+)/g) && coef.match(/(\d+)/g)[0] === coef) {
        weight = parseFloat(coef, 10);
      } else {
        weight = coef.split(/([A-Z]?[^A-Z]*)/g).filter(e => !!e).map(e => {
          let [element, count] = e.split(/(\d+)/g);
          count = parseInt(count, 10) || 1;
          weight = ElementalMassHelper.elements[element];
          return element ? weight * count : ElementalMassHelper.fragments[element];
        }).reduce((w, sum) => w + sum, 0);
      }
    }
    return (charge === 0 ? weight : weight - ElementalMassHelper.electron * charge).toPrecision(9);
  },

  parseNumeric(value) {
    return value.replace(/[^0-9.\-]+/g, '');
  },

  solveDisabled(solving, rows, totalMass, maxError) {
    return solving ||
           rows.length === 0 ||
           !rows.every(row => row.weight && !isNaN(row.weight)) ||
           totalMass === 0 ||
           totalMass === '' ||
           maxError === '';
  },

  numCombinations(rows) {
    return rows.map(row => (parseInt(row.range.max, 10) - parseInt(row.range.min, 10)) + 1).reduce((val, product) => val * product, 1);
  },

  formatRows(rows) {
    return rows.map(row => ({
      weight: parseFloat(row.weight),
      range: {
        min: parseInt(row.range.min, 10),
        max: parseInt(row.range.max, 10)
      }
    }));
  }
};

module.exports = SolveHelper;