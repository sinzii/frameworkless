const FwlError = require('./fwl_error');

class HttpError extends FwlError {

}

global.HttpError = HttpError;
module.exports = HttpError;
