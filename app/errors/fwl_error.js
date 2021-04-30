const { StatusCodes } = require('http-status-codes');
const errorUtils = require('../utils/error');

class FwlError extends Error {
    constructor(message) {
        super(message);
    }

    getErrorMessage() {
        return {
            message: this.message
        }
    }

    get statusCode() {
        return StatusCodes.INTERNAL_SERVER_ERROR;
    }

    async handleResponse(res) {
        if (res.req.isRestApiRequest()) {
            res.sendJson(this.getErrorMessage(), this.statusCode);
        } else {
            await errorUtils.sendErrorCode(res, this.statusCode, this.message);
        }
    }
}

global.FwlError = FwlError;
module.exports = FwlError;
