'use strict';

var OObject = require('olives').OObject;
var EventPlugin = require('olives')['Event.plugin'];
var BindPlugin = require('olives')['Bind.plugin'];
var tools = require('../lib/tools');
var router = require('../lib/router');
var RouterPlugin = require('../lib/routerPlugin');


module.exports = function listInit(view, model, stats) {
    var list = new OObject(model);

    var ENTER_KEY = 13;

    list.seam.addAll({
        event: new EventPlugin(list),
        model: new BindPlugin(model, {
            'toggleClass': tools.toggleClass
        }),
        router: new RouterPlugin(router),
        stats: new BindPlugin(stats, {
            'toggleClass': tools.toggleClass,
            'toggleCheck': function (value) {
                this.checked = model.count() === value ? 'on' : '';
            }
        })
    });

    list.remove = function remove(event, node) {
        model.del(node.getAttribute('data-model_id'));
    };

    list.toggleAll = function toggleAll(event, node) {
        var checked = !!node.checked;

        model.loop(function (value, idx) {
            this.update(idx, 'completed', checked);
        }, model);
    };

    list.startEdit = function startEdit(event, node) {
        var taskId = node.getAttribute('data-model_id');

        tools.toggleClass.call(view.querySelector('li[data-model_id="' + taskId + '"]'), true, 'editing');
        view.querySelector('input.edit[data-model_id="' + taskId + '"]').focus();
    };

    list.stopEdit = function stopEdit(event, node) {
        var taskId = +node.getAttribute('data-model_id');
        var value;

        if (event.keyCode === ENTER_KEY) {
            value = node.value.trim();

            if (value) {
                model.update(taskId, 'title', value);
            } else {
                model.del(taskId);
            }

            if (model.has(taskId)) {
                tools.toggleClass.call(view.querySelector('li[data-model_id="' + taskId + '"]'), false, 'editing');
            }
        } else if (event.type === 'blur') {
            tools.toggleClass.call(view.querySelector('li[data-model_id="' + taskId + '"]'), false, 'editing');
        }
    };

    list.alive(view);
};
