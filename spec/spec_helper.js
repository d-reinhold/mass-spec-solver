require('jasmine_dom_matchers');
require('babel-core/register');
require('babel-polyfill');

const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

Object.assign(global, {$, jQuery: $, React, ReactDOM});

beforeEach(() => {
  $('body').find('#root').remove().end().append('<div id="root"/>');
});

afterEach(function () {
  ReactDOM.unmountComponentAtNode(root);
});
