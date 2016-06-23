require('jasmine_dom_matchers');
require('babel-core/register');
require('babel-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const $ = require('jquery');

$.fn.simulate = function(eventName, ...args) {
  if (!this.length) {
    throw new Error(`jQuery Simulate has an empty selection for '${this.selector}'`);
  }
  $.each(this, function() {
    if (['mouseOver', 'mouseOut'].includes(eventName)) {
      TestUtils.SimulateNative[eventName](this, ...args);
    } else {
      TestUtils.Simulate[eventName](this, ...args);
    }
  });
  return this;
};

TestUtils.Simulate.check = function(node) {
  TestUtils.Simulate.change(node, {target: {checked: true}});
};

TestUtils.Simulate.uncheck = function(node) {
  TestUtils.Simulate.change(node, {target: {checked: false}});
};

Object.assign(global, {$, jQuery: $, React, ReactDOM});

beforeEach(() => {
  $('body').find('#root').remove().end().append('<div id="root"/>');
});

afterEach(function () {
  ReactDOM.unmountComponentAtNode(root);
});
