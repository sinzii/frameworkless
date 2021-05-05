const loader = require('../loader');

module.exports = exports = {};

const excludeFiles = ['BaseService.js', 'index.js']
loader.loadModules(
    './services',
    (file) => !excludeFiles.includes(file),
    (mod) => {
        exports[mod.constructor.name] = mod;
    }
)
