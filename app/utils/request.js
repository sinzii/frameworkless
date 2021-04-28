const parseRequestUrl = (req) => {
    const {url} = req;

    const [path, queryString] = url.split('?');
    const query = {};
    if (queryString) {
        const qs = queryString.split('&');
        for (const each of qs) {
            const [name, value] = each.split('=');
            if (name) {
                query[name] = value;
            }
        }
    }

    req.path = path;
    req.queryString = queryString;
    req.query = query;
}

const parseRequestBody = (req) => {
    req.body = {};
}

module.exports = {
    parseRequestUrl,
    parseRequestBody
}
