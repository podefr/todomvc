'use strict';

var OObject = require('olives').OObject;
var EventPlugin = require('olives')['Event.plugin'];

module.exports = function inputInit(view, model) {
    var input = new OObject(model);
    var ENTER_KEY = 13;

    input.seam.add('event', new EventPlugin(input));

    input.addTask = function addTask(event, node) {
        if (event.keyCode === ENTER_KEY && node.value.trim()) {
            model.alter('push', {
                title: node.value.trim(),
                completed: false
            });
            node.value = '';
        }
    };

    input.alive(view);
};
