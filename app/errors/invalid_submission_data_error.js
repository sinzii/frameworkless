const BusinessError = require('./business_error');

class InvalidSubmissionDataError extends BusinessError {
    constructor(message = 'Invalid submission data', errors) {
        super(message);
        this.errors = errors;
    }
}

global.InvalidSubmissionDataError = InvalidSubmissionDataError;
module.exports = InvalidSubmissionDataError;
