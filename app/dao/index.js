const fs = require('fs');
const path = require('path');
const config = require('../config');

module.exports = exports = {};

const dbType = config['DB_TYPE'];

const daoDir = path.join(__dirname, dbType);
const files = fs.readdirSync(daoDir);

for (const file of files) {
    if (file === 'base.js') {
        continue;
    }

    const module = file.replace('.js', '');
    const dao = require(`./${dbType}/${module}`);
    exports[dao.constructor.name] = dao;
}
