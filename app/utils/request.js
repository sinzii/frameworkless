const getRawBody = require('raw-body');

const queryStringToMap = (queryString) => {
    const query = {};

    if (!queryString) {
        return query;
    }

    const qs = queryString.split('&');
    for (const each of qs) {
        const [name, value] = each.split('=');
        if (name) {
            query[name] = decodeURIComponent(value);
        }
    }

    return query;
}

const parseRequestUrl = (req) => {
    const {url} = req;

    const [path, queryString] = url.split('?');
    const query = queryStringToMap(queryString);

    req.path = path;
    req.queryString = queryString;
    req.query = query;
}

const parseRequestBody = async (req) => {
    const contentLength = req.headers['content-length'] || null;
    const rawBody = await getRawBody(req, {
        length: contentLength,
        encoding: true,
        limit: '10mb'
    });

    const contentType = req.headers['content-type'] || 'plain/text';
    switch (contentType) {
        case 'application/json':
            req.body = JSON.parse(rawBody);
            break;
        case 'application/x-www-form-urlencoded': // Form Post
            req.body = queryStringToMap(rawBody);
            break;
        case 'multipart/form-data': // File upload
            break;
        default:
            req.body = rawBody;
    }
}

module.exports = {
    parseRequestUrl,
    parseRequestBody
}
