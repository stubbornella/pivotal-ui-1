require('jasmine_dom_matchers');
require('phantomjs-polyfill');

global.React = require('react');
global.ReactDOM = require('react-dom');
global.TestUtils = require('react-addons-test-utils');

var jQuery = require('jquery');
var MockNow = require('performance-now');
var MockRaf = require('raf');

Object.assign(global, {
  jQuery,
  MockNow,
  MockRaf,
  $: jQuery
});

$.fn.simulate = function(eventName, ...args) {
  if (!this.length) {
    throw new Error(`jQuery Simulate has an empty selection for '${this.selector}'`);
  }
  $.each(this, function() {
    if (['mouseOver', 'mouseOut', 'click'].indexOf(eventName) !== -1) {
      TestUtils.SimulateNative[eventName](this, ...args);
    } else {
      TestUtils.Simulate[eventName](this, ...args);
    }
  });
  return this;
};

global.shallowRender = function shallowRender(jsx) {
  const shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(jsx);
  return shallowRenderer.getRenderOutput();
};

beforeEach(function() {
  jasmine.clock().install();
  $('body').find('#root').remove().end().append('<main id="root"/>');
});

beforeEach(function() {
  const consoleWarn = console.warn;
  console.warn = function(message) {
    if(message.match(/Failed propType/)) {
      throw new Error(message);
    } else {
      consoleWarn.apply(console, arguments);
    }
  };


  jasmine.addMatchers({
    toPassADT: require('./accessibility-developer-tools-matcher')
  });
});

afterEach(function() {
  MockNow.reset();
  MockRaf.reset();
  jasmine.clock().uninstall();
});
