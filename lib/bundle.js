(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _utils = require('scheduler/utils');

// Wrapper around a function
var task = function task(fn) {
  return {
    fn: fn,
    run: function run() {
      try {
        return fn();
      } catch (e) {
        throw e;
      }
    },
    defer: function defer() {
      Promise.resolve().then(this.run);
    }
  };
};

// Time-Ordered Priority Queue


var timeline = function timeline() {
  var tasks = [];

  var add = function add(t, x) {
    tasks.push({ time: t, task: x });
  };

  var get = function get(a, b) {
    return [tasks.pop()];
  };

  return {
    add: add,
    get: get
  };
};

// Self-referencing Timeline consumer

var scheduler = function scheduler() {
  var __timeline = timeline();
  var last_run = -1;

  var schedule = function schedule(w, t) {
    __timeline.add(w, t);
  };

  var run = function run() {
    // Get all the tasks in the timeline between
    // the last run and right now
    __timeline.get(last_run, (0, _utils.tick)()).map(function (x) {
      return x.defer();
    });
  };

  return { schedule: schedule, run: run };
};

},{"scheduler/utils":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// https://www.w3.org/TR/hr-time/#monotonic-clock
var tick = function tick() {
  return window.performance.now() | 0;
};

var _now_time = function _now_time() {
  return new Date().toTimeString().split(' ')[0];
};
var now = function now() {
  return _now_time() + ":" + tick();
};

var log = function log() {
  var _console;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // @todo: use ${NODE_ENV} here instead
  // let envsubst do the job
  "${NODE_ENV}" !== "production" && (_console = console).log.apply(_console, [now()].concat(_toConsumableArray(args)));
};

log.ns = function (namespace) {
  return log.bind({}, namespace);
};

var error = log.ns("ERROR:");
var info = log.ns("INFO:");

var atom = function atom() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var keys = args.map(Symbol.for);
  return keys.length === 1 ? keys[0] : keys;
};
window.atom = atom;

exports.atom = atom;
exports.error = error;
exports.info = info;
exports.log = log;
exports.tick = tick;

},{}]},{},[1])
//# sourceMappingURL=bundle.js.map
