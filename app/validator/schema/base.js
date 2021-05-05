const yup = require('yup');

const BaseSchema = {
    id: yup.string().required(),
    createdAt: yup.date().nullable().default(null),
    createdBy: yup.string().nullable().default(null),
    updatedAt: yup.date().nullable().default(null),
    updatedBy: yup.string().nullable().default(null)
}

module.exports = BaseSchema;
