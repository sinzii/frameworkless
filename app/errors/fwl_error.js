class FwlError extends Error {
    constructor(message) {
        super(message);
    }
}

global.FwlError = FwlError;
module.exports = FwlError;
