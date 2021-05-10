const viewsEngine = require('../views_engine');

const sendErrorCode = async (res, statusCode = 500, message) => {
    message = message || 'There was a problem occurred while processing the request.';

    let errorPage;
    try {
        errorPage = await viewsEngine.getTemplate(`error_${statusCode}`);
    } catch (e) {
        errorPage = await viewsEngine.getTemplate(`error`);
    }

    res.send(errorPage({message, statusCode}), statusCode);
}


const send404Error = async (res, message = "Oops! There's nothing here!") => {
    await sendErrorCode(res, 404, message);
}

module.exports = {
    sendErrorCode,
    send404Error
}

