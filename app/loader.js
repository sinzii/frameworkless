const fs = require('fs');
const path = require('path');
const logger = require('log4js').getLogger('loader');

const loadModules = (moduleDir, filePredicate, afterLoadingModule) => {
    const files = fs.readdirSync(path.join(__dirname, moduleDir));

    for (const file of files) {
        if (typeof filePredicate === 'function' && !filePredicate(file)) {
            continue;
        }

        const filePath = path.join(__dirname, moduleDir, file);
        logger.debug('Load module', filePath);
        const stat = fs.lstatSync(filePath)

        if (stat.isFile()) {
            const moduleName = file.replace('.js', '');
            const mod = require(`./${moduleDir}/${moduleName}`);

            if (typeof afterLoadingModule === 'function') {
                afterLoadingModule(mod);
            }
        }
    }
}

const loadControllers = (controllerDir) => {
    loadModules(controllerDir, (fileName) => fileName.endsWith('controller.js'));
}

const loadRestApi = (restApiDir) => {
    loadModules(restApiDir, (fileName) => fileName.endsWith('resource.js'));
}

module.exports = {
    loadModules,
    loadControllers,
    loadRestApi
}
