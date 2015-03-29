(function () {
    'use strict';

    var tools = require('./tools');

    /**
     * A quick plugin to interface with a url-highway router.
     * @param {url highway} the router's instance
     * @constructor
     */
    module.exports = function RouterPlugin(router) {
        /**
         * Set a given className to a dom element if its hash matches with the url's hash
         * @param link
         * @param className
         */
        this.isActive = function isActive(link, className) {
            if (router.getLastRoute() === link.hash) {
                link.classList.add(className);
            }
            router.watch(function (route) {
                tools.toggleClass.call(link, link.hash === route, className);
            });
        };
    };

})();