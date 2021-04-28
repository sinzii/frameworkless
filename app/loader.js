const fs = require('fs');
const path = require('path');

const loadModules = (moduleDir, filePredicate) => {
    const files = fs.readdirSync(path.join(__dirname, moduleDir));

    for (const file of files) {
        if (typeof filePredicate === 'function' && !filePredicate(file)) {
            continue;
        }

        const filePath = path.join(__dirname, moduleDir, file);
        const stat = fs.lstatSync(filePath)

        if (stat.isFile()) {
            const moduleName = file.replace('.js', '');
            require(`./${moduleDir}/${moduleName}`);
        }
    }
}

const loadControllers = (controllerDir) => {
    loadModules(controllerDir, (fileName) => fileName.endsWith('controller.js'));
}

module.exports = {
    loadModules,
    loadControllers
}
