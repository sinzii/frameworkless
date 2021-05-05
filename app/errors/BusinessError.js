const FwlError = require('./FwlError');

class BusinessError extends FwlError {
    constructor(message) {
        super(message);
    }
}

global.BusinessError = BusinessError;
module.exports = BusinessError;
