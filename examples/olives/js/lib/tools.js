'use strict';

module.exports = {
    toggleClass: function toggleClass(value, className) {
        if (value) {
            this.classList.add(className);
        } else {
            this.classList.remove(className);
        }
    }
};
