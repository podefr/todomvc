(function () {
    'use strict';

    var UrlHighway = require("url-highway");

    var urlHighway = new UrlHighway();

    urlHighway.parse = function (hash) {
        return [ hash ];
    };

    urlHighway.start();

    module.exports = urlHighway;
})();