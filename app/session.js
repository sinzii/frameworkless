/**
 * Since there's no session library for pure NodeJs application (as far as what I've searched),
 * so to save time from building from scratch one.
 * I decided to use express-session for session management purpose.
 *
 * express-session is designed to work with express framework,
 * so in order for it to work with our application
 * we need to provide a fake next function as a hack for the library to function smoothly.
 */
const config = require('./config');
const expressSession = require('express-session');

const maxAgeInMinute = config['HTTP_SESSION_MAX_AGE_IN_MINUTE'] || 60;

const sessionFn = expressSession({
    name: 'FWL-SESSION-ID',
    secret: config['SECURITY_SIGNING_SECRET'],
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: config.prod,
        maxAge: maxAgeInMinute * 60 * 1000 // milliseconds
    }
});

const session = async (req, res) => {
    return new Promise((resolve, reject) => {
        const fakeNext = (err) => {
            if (err) {
                reject(new FwlError(err.message));
            } else {
                resolve();
            }
        }

        sessionFn(req, res, fakeNext);
    });
}

module.exports = session;
