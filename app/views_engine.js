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
            readTemplatesSync(path.join(folder, file), callback);
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

const registerHelpers = () => {
    Handlebars.registerHelper('equals', (currentPath, targetPath, options) => {
        return currentPath === targetPath;
    });

    Handlebars.registerHelper('or', function() {
        const orValues = [...arguments].slice(0, arguments.length - 1);

        let v;
        for (v of orValues) {
            if (v) {
                return v;
            }
        }

        return v;
    });

    Handlebars.registerHelper('and', function () {
        const andValues = [...arguments].slice(0, arguments.length - 1);
        return andValues.every(v => !!v);
    });
}

/**
 * Setup views
 */
const setup = function () {
    registerPartialTemplates();
    registerTemplates();
    registerHelpers();
};

/**
 * Get a specific template by name
 *
 * @param name
 * @returns {Promise<Function>}
 */
const getTemplate = function (name) {
    // TODO load compiled template for production
    // return templateHolder[name];

    // TODO for development
    return new Promise((resolve, reject) => {
        const filePath = templateFiles[name];
        if (!filePath) {
            throw new Error('Template is not existed');
        }

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

const renderTemplate = async (req, name, data = {}) => {
    if (arguments.length === 2 && typeof req === 'string') {
        name = req;
        data = name;
        req = false;
    }

    const templateData = {};

    if (req) {
        Object.assign(templateData, {
            _req: req,
            _query: req.query,
            _body: req.body,
            _session: req.session,
            _baseUrl: req.baseUrl()
        });

        Object.assign(templateData, req.attrs());
    }

    if (data) {
        Object.assign(templateData, data);
    }

    return (await getTemplate(name))(templateData);
}

const render = async function (req, res, name, data) {
    res.send(await renderTemplate(req, name, data));
}

module.exports = {
    setup,
    getTemplate,
    render,
    renderTemplate
}
