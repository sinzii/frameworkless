const { ValidationError } = require('yup');
const StringUtils = require('../utils/string');
const loader = require('../loader');
const logger = require('log4js').getLogger('validator');

logger.debug("Load validation schemas")
const schemas = {};
loader.loadModules(
    './validator/schema',
    undefined,
    (mod) => {
        Object.assign(schemas, mod);
    }
)

const getSchema = (name) => {
    const schema = schemas[name];
    if (!schema) {
        throw new BusinessError('Schema is not existed');
    }

    return schema;
}

const validate = async (schemaName, data, options) => {
    const schema = getSchema(schemaName);

    const opts = {
        stripUnknown: true,
        abortEarly: false
    };

    Object.assign(opts, options);

    try {
        await schema.validate(data, opts);
    } catch (e) {
        let errors = null;

        if (e instanceof ValidationError) {
            errors = e.inner.reduce((_errors, one) => {
                _errors[one.path] = StringUtils.capitalize(one.message);
                return _errors;
            }, {});
        }

        throw new InvalidSubmissionDataError(undefined, errors);
    }
}

module.exports = {
    schemas,
    getSchema,
    validate
}
