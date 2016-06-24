const ElementalMassHelper = require('helpers/elemental_mass_helper');

const SolveHelper = {
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

  emptyRow() {
    return {
      id: Math.floor(Math.random() * 1000),
      coef: '',
      range: {min: 0, max: 5},
      charge: 0,
      weight: null
    };
  },

  parseNumeric(value) {
    return value.replace(/[^0-9.]+/g, '');
  }
};

module.exports = SolveHelper;