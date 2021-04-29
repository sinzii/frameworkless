const app = require('./app');

(async () => {
    try {
        await app();
    } catch (e) {
        const logger = require('log4js').getLogger('app');
        logger.error(e);

        process.exit(1);
    }
})();

