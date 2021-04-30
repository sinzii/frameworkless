const viewsEngine = require('../views_engine');

const sendErrorCode = async (res, statusCode = 500, message) => {
    message = message || 'There was a problem occurred while processing the request.';

    try {
        const errorPage = await viewsEngine.getTemplate(`error_${statusCode}`);
        res.send(errorPage({message, statusCode}), statusCode);
    } catch (e) {
        res.send(message, statusCode, 'text/plain');
    }
}


const send404Error = async (res, message = "Oops! There's nothing here!") => {
    await sendErrorCode(res, 404, message);
}

module.exports = {
    sendErrorCode,
    send404Error
}

