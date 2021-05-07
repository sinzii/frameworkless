const FwlError = require('./FwlError');
const {StatusCodes} = require('http-status-codes');

class PermissionDeniedError extends FwlError {
    constructor(message = 'Permission Denied') {
        super(message);
    }

    get statusCode() {
        return StatusCodes.FORBIDDEN;
    }
}

global.PermissionDeniedError = PermissionDeniedError;
module.exports = PermissionDeniedError;
