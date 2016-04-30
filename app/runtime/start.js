require('babel-core/register');
require('babel-polyfill');
require('pui-css-alignment');
require('pui-css-whitespace');
const React = require('react');
const ReactDOM = require('react-dom');
const Application = require('components/application');

global.Chemsack = {
  start() {
    ReactDOM.render(<Application />, root);
  }
};
