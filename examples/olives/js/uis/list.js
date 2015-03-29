(function () {
    'use strict';

    var OObject = require('olives').OObject;
    var EventPlugin = require('olives')['Event.plugin'];
    var BindPlugin = require('olives')['Bind.plugin'];
    var Tools = require('../lib/Tools');

    module.exports = function listInit(view, model, stats) {
        // The OObject (the controller) inits with a default model which is a simple store
        // But it can be init'ed with any other store, like the LocalStore
        var list = new OObject(model);
        var ENTER_KEY = 13;

        // The plugins
        list.seam.addAll({
            'event': new EventPlugin(list),
            'model': new BindPlugin(model, {
                'toggleClass': Tools.toggleClass
            }),
            'stats': new BindPlugin(stats, {
                'toggleClass': Tools.toggleClass,
                'toggleCheck': function (value) {
                    this.checked = model.count() === value ? 'on' : '';
                }
            })
        });

        // Remove the completed task
        list.remove = function remove(event, node) {
            model.del(node.getAttribute('data-model_id'));
        };

        // Un/check all tasks
        list.toggleAll = function toggleAll(event, node) {
            var checked = !!node.checked;

            model.loop(function (value, idx) {
                this.update(idx, 'completed', checked);
            }, model);
        };

        // Enter edit mode
        list.startEdit = function (event, node) {
            var taskId = node.getAttribute('data-model_id');

            Tools.toggleClass.call(view.querySelector('li[data-model_id="' + taskId + '"]'), true, 'editing');
            view.querySelector('input.edit[data-model_id="' + taskId + '"]').focus();
        };

        // Leave edit mode
        list.stopEdit = function (event, node) {
            var taskId = node.getAttribute('data-model_id');
            var value;

            if (event.keyCode === ENTER_KEY) {
                value = node.value.trim();

                if (value) {
                    model.update(taskId, 'title', value);
                } else {
                    model.del(taskId);
                }

                // When task #n is removed, #n+1 becomes #n, the dom node is updated to the new value, so editing mode should exit anyway
                if (model.has(taskId)) {
                    Tools.toggleClass.call(view.querySelector('li[data-model_id="' + taskId + '"]'), false, 'editing');
                }
            } else if (event.type === 'blur') {
                Tools.toggleClass.call(view.querySelector('li[data-model_id="' + taskId + '"]'), false, 'editing');
            }
        };

        // Alive applies the plugins to the HTML view
        list.alive(view);
    };
})();