const BusinessError = require('./business_error');
const { StatusCodes } = require('http-status-codes')

class InvalidSubmissionDataError extends BusinessError {
    constructor(message = 'Invalid submission data', errors) {
        super(message);
        this.errors = errors;
    }

    getErrorMessage() {
        const response = super.getErrorMessage();
        response.errors = this.errors;

        return response;
    }

    get statusCode() {
        return StatusCodes.NOT_ACCEPTABLE;
    }
}

global.InvalidSubmissionDataError = InvalidSubmissionDataError;
module.exports = InvalidSubmissionDataError;
