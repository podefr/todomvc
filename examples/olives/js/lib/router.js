(function () {
    'use strict';

    /**
     * Instantiate the main app's router
     */
    var UrlHighway = require('url-highway');

    var urlHighway = new UrlHighway();

    // It overrides the default parser to accept urls that start with /
    urlHighway.parse = function (hash) {
        return [ hash ];
    };

    urlHighway.start();

    module.exports = urlHighway;
})();