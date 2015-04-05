'use strict';

var input = require('./uis/input');
var list = require('./uis/list');
var controls = require('./uis/controls');

var LocalStore = require('olives').LocalStore;
var Store = require('emily').Store;

var tasks = new LocalStore([]);

var stats = new Store({
    nbItems: 0,
    nbLeft: 0,
    nbCompleted: 0,
    plural: 'items'
});

tasks.sync('todos-olives');

input(document.querySelector('#header input'), tasks);

list(document.querySelector('#main'), tasks, stats);

controls(document.querySelector('#footer'), tasks, stats);
