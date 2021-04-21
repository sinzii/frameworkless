const viewsEngine = require('../views_engine');

const sendErrorCode = async (res, statusCode = 500, message) => {
    message = message || 'There was a problem occurred while processing the request.';

    try {
        const errorPage = await viewsEngine.getTemplate(`error_${statusCode}`);
        res.setHeader('Content-Type', 'text/html');
        res.end(errorPage({message, statusCode}));
    } catch (e) {
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'text/plain');
        res.end(message);
    }
}


const send404Error = async (res, message = "Oops! There's nothing here!") => {
    await sendErrorCode(res, 404, message);
}

module.exports = {
    sendErrorCode,
    send404Error
}

