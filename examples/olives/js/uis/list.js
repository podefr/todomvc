(function () {
    'use strict';

    var Store = require('emily').Store;
    var OObject = require('olives').OObject;
    var EventPlugin = require('olives')['Event.plugin'];
    var BindPlugin = require('olives')['Bind.plugin'];
    var tools = require('../lib/tools');
    var router = require('../lib/router');

    // These filters will filter down the list of tasks
    // depending on what we want to display (all, active or completed)
    var FILTERS = {
        '#/': function () {
            return true;
        },
        '#/completed': function (task) {
            return task.completed === true;
        },
        '#/active': function (task) {
            return task.completed === false;
        }
    };

    var ENTER_KEY = 13;

    module.exports = function listInit(view, model, stats) {
        // The OObject (the controller) inits with a default model which is a simple store
        // But it can be init'ed with any other store, like the LocalStore
        var list = new OObject(model);
        var tasksToDisplay = new Store([]);
        var eventPlugin = new EventPlugin(list);
        var modelPlugin = new BindPlugin(tasksToDisplay, {
            'toggleClass': tools.toggleClass
        });
        var statsPlugin = new BindPlugin(stats, {
            'toggleClass': tools.toggleClass,
            'toggleCheck': function (value) {
                this.checked = model.count() === value ? 'on' : '';
            }
        });
        var currentRoute = router.getLastRoute();

        // The plugins
        list.seam.addAll({
            'event': eventPlugin,
            'model': modelPlugin,
            'stats': statsPlugin
        });

        // Remove the completed task
        list.remove = function remove(event, node) {
            var index = modelPlugin.getItemIndex(node);
            model.del(index);
        };

        // Un/check all tasks
        list.toggleAll = function toggleAll(event, node) {
            var checked = !!node.checked;

            model.loop(function (value, idx) {
                this.update(idx, 'completed', checked);
            }, model);
        };

        // Toggle completed in the original list of tasks
        list.toggleCompleted = function toggleCompleted(event, node) {
            var checked = !!node.checked;
            var index = modelPlugin.getItemIndex(node);
            model.update(index, 'completed', checked);
        };

        // Enter edit mode
        list.startEdit = function (event, node) {
            var taskId = modelPlugin.getItemIndex(node);

            tools.toggleClass.call(getDomAtIndex(taskId, 'li'), true, 'editing');
            getDomAtIndex(taskId, 'input.edit').focus();
        };

        // Leave edit mode
        list.stopEdit = function (event, node) {
            var taskId = modelPlugin.getItemIndex(node);
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
                    tools.toggleClass.call(getDomAtIndex(taskId, 'li'), false, 'editing');
                }
            } else if (event.type === 'blur') {
                tools.toggleClass.call(getDomAtIndex(taskId, 'li'), false, 'editing');
            }
        };

        // As of Olives 3.0.5, Bind.plugin#foreach doesn't support filtering
        // so the list of tasks to display is a new model with a subset of the original list
        function setTasksToDisplay() {
            var filteredItems = model
                .dump()
                .filter(FILTERS[currentRoute]);
            tasksToDisplay.reset(filteredItems);
        }

        router.set('#/', function () {
            currentRoute = '#/';
            setTasksToDisplay();
        });

        router.set('#/completed', function () {
            currentRoute = '#/completed';
            setTasksToDisplay();
        });

        router.set('#/active', function () {
            currentRoute = '#/active';
            setTasksToDisplay();
        });

        // And listen to changes
        model.watch('added', setTasksToDisplay);
        model.watch('updated', setTasksToDisplay);
        model.watch('deleted', setTasksToDisplay);

        setTasksToDisplay();

        // Alive applies the plugins to the HTML view
        list.alive(view);

        function getDomAtIndex(index, domCSS) {
            return view.querySelector(domCSS + '[data-model_id="' + index + '"]');
        }
    };
})();