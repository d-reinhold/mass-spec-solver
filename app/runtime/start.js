require('babel-core/register');
require('babel-polyfill');
require('pui-css-alignment');
require('pui-css-whitespace');
const React = require('react');
const ReactDOM = require('react-dom');
const Rison = require('rison');
const Application = require('components/application');
const Store = require('./store');
const SolveHelper = require('../helpers/solve_helper');
const AWS = require('aws-sdk');
AWS.config.update({accessKeyId: 'AKIAILE7UA4MZKS7LBTQ', secretAccessKey: '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'});
AWS.config.region = 'us-west-2';
AWS.config.apiVersions = {lambda: '2015-03-31'};
const urlState = location.hash.slice(1).length ? Rison.decode(location.hash.slice(1)) : {};
const defaultState = {
  totalMass: 0,
  totalCharge: '',
  maxError: 0.01,
  rows: [SolveHelper.emptyRow()],
  page: 'Solve',
  strategy: {offline: false, algorithm: 'mitm_bs'},
  solutions: null,
  solving: false,
};
const initialState = {...defaultState, ...urlState};

Store.init(initialState, data => {
  ReactDOM.render(<Application {...data}/>, root);
  const {totalMass, totalCharge, maxError, rows, page, strategy} = data;
  history.pushState(null, null, `#${Rison.encode({totalMass, totalCharge, maxError, rows, page, strategy})}`);
});

