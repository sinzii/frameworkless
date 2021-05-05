const FwlError = require('./fwl_error');
const { StatusCodes } = require('http-status-codes');

class ResourceNotFoundError extends FwlError {
    constructor(message = 'Resource is not found') {
        super(message);
    }

    get statusCode() {
        return StatusCodes.NOT_FOUND;
    }
}

global.ResourceNotFoundError = ResourceNotFoundError;
module.exports = ResourceNotFoundError;
