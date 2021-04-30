const FwlError = require('./fwl_error');

class DaoError extends FwlError {
    constructor(message) {
        super(message);
    }
}

global.DaoError = DaoError;
module.exports = DaoError;
