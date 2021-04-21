const sendErrorCode = (res, statusCode = 500, message) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'text/plain');
    res.end(message || 'There was a problem occurred while processing the request.');
}


const send404Error = (res, message = "Oops! There's nothing here!") => {
    sendErrorCode(res, 404, message);
}

module.exports = {
    sendErrorCode,
    send404Error
}

