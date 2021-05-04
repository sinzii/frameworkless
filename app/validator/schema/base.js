const yup = require('yup');

const BaseSchema = {
    id: yup.number().required(),
    createdAt: yup.date(),
    createdBy: yup.number(),
    updatedAt: yup.date(),
    updatedBy: yup.number()
}

module.exports = BaseSchema;
