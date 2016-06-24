const Cursor = require('pui-cursor');

const Store = {
  init(initialData, onUpdate) {
    this.update(initialData, onUpdate);
  },

  update(data, onUpdate) {
    this.cursor = new Cursor(data, newData => Store.update(newData, onUpdate));
    onUpdate(data);
  }
};

module.exports = Store;