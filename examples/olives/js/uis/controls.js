'use strict';

var OObject = require('olives').OObject;
var EventPlugin = require('olives')['Event.plugin'];
var BindPlugin = require('olives')['Bind.plugin'];
var Tools = require('../lib/Tools');
var router = require('../lib/router');
var RouterPlugin = require('../lib/routerPlugin');

module.exports = function controlsInit(view, model, stats) {
    var controls = new OObject(model);

    function getCompleted() {
        var completed = [];
        model.loop(function (value, id) {
            if (value.completed) {
                completed.push(id);
            }
        });
        return completed;
    }

    function updateStats() {
        var nbCompleted = getCompleted().length;

        stats.set('nbItems', model.count());
        stats.set('nbLeft', stats.get('nbItems') - nbCompleted);
        stats.set('nbCompleted', nbCompleted);
        stats.set('plural', stats.get('nbLeft') === 1 ? 'item' : 'items');
    }

    controls.seam.addAll({
        event: new EventPlugin(controls),
        router: new RouterPlugin(router),
        stats: new BindPlugin(stats, {
            'toggleClass': Tools.toggleClass
        })
    });

    controls.alive(view);

    controls.delAll = function dellAll() {
        model.delAll(getCompleted());
    };

    model.watch('added', updateStats);
    model.watch('deleted', updateStats);
    model.watch('updated', updateStats);

    updateStats();
};
