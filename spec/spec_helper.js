require('babel-core/register');
require('babel-polyfill');
const Bluebird = require('bluebird');
Bluebird.prototype.catch = function(...args) {
  return Bluebird.prototype.then.call(this, i => i, ...args);
};
global.Promise = Bluebird;
require('jasmine_dom_matchers');
require('spy-on-render');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const MockPromises = require('mock-promises');
const $ = require('jquery');
const Deferred = require('./support/deferred');
jasmine.MAX_PRETTY_PRINT_DEPTH = 5;

const spyOnAsync = (Thing, methodName) => {
  const promise = new Deferred();
  spyOn(Thing, methodName).and.returnValue(promise);
  return promise;
};

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

TestUtils.Simulate.changeValue = TestUtils.Simulate.select = function(node, value) {
  TestUtils.Simulate.change(node, {target: {value}});
};

Object.assign(global, {$, jQuery: $, React, ReactDOM, _: jasmine.anything(), spyOnAsync, MockPromises});

beforeEach(() => {
  jasmine.clock().install();
  MockPromises.install(Promise);
  $('body').find('#root').remove().end().append('<div id="root"/>');
});

afterEach(function () {
  jasmine.clock().uninstall();
  MockPromises.contracts.reset();
  ReactDOM.unmountComponentAtNode(root);
});
