require('babel-core/register');
require('babel-polyfill');
require('pui-css-alignment');
require('pui-css-whitespace');
const Application = require('components/application');

global.Chemsack = {
  start() {
    ReactDOM.render(<Application />, root);
  }
};
