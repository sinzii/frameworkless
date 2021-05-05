const config = require('../config');
const loader = require('../loader');

module.exports = exports = {};

const dbType = config['DB_TYPE'];
const excludeFiles = ['BaseDao.js'];

loader.loadModules(
    `./dao/${dbType}`,
    (file) => !excludeFiles.includes(file),
    (mod) => {
        exports[mod.constructor.name] = mod;
    }
)
