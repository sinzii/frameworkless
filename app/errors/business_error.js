const FwlError = require('./fwl_error');

class BusinessError extends FwlError {
    constructor(message) {
        super(message);
    }
}

global.BusinessError = BusinessError;
module.exports = BusinessError;
