const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');

const templateSuffix = '.hbs';

/**
 * Read the folder and looping though all files inside. Yes, recursively!
 *
 * @param folder
 * @param callback
 */
function readTemplatesSync(folder, callback) {
    const files = fs.readdirSync(path.join(__dirname, folder));

    for (const file of files) {
        const filePath = path.join(__dirname, folder, file);
        const stat = fs.lstatSync(filePath);
        if (stat.isFile() && path.extname(filePath) === templateSuffix) {
            const content = fs.readFileSync(filePath, 'utf-8');

            callback(path.join(folder, file), content, filePath);
        } else if (stat.isDirectory()) {
            readTemplatesSync(filePath, callback);
        }
    }
}

/**
 * Register partial templates
 *
 * @type {string}
 */
const partialsFolder = '../templates/partials';
function registerPartialTemplates() {
    readTemplatesSync(partialsFolder, (filePath, content) => {
        const partialName = filePath
            .replace(path.join(partialsFolder, '/'), '')
            .replace(templateSuffix, '');

        Handlebars.registerPartial(partialName, content)
    });
}

/**
 * Register page templates and caching them in a map for further using.
 *
 * @type {{}}
 */
const templateHolder = {};
const templateFiles = {};
const templateFolder = '../templates/pages';
function registerTemplates() {
    readTemplatesSync(templateFolder, (filePath, content, absolutePath) => {
        const templateName = filePath
            .replace(path.join(templateFolder, '/'), '')
            .replace(templateSuffix, '');

        templateHolder[templateName] = Handlebars.compile(content);
        templateFiles[templateName] = absolutePath;
    });
}

/**
 * Setup views
 */
exports.setup = function () {
    registerPartialTemplates();
    registerTemplates();
};

/**
 * Get a specific template by name
 *
 * @param name
 * @returns {Promise<unknown>}
 */
exports.getTemplate = function (name) {
    // TODO load compiled template for production
    // return templateHolder[name];

    // TODO for development
    return new Promise((resolve, reject) => {
        fs.readFile(templateFiles[name], 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                registerPartialTemplates();
                resolve(Handlebars.compile(data));
            }
        })
    });
};
