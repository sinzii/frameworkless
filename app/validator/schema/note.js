const yup = require('yup');

const CreateNoteSchema = yup.object().shape({
    title: yup.string().required().max(5000).default(''),
    content: yup.string().required().default('')
});

module.exports = {
    CreateNoteSchema,
    UpdateNoteSchema: CreateNoteSchema
}
