const FwlError = require('./FwlError');

class HttpError extends FwlError {

}

global.HttpError = HttpError;
module.exports = HttpError;
