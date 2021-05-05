const yup = require('yup');
const BaseSchema = require('./BaseSchema');

const NoteSchema = yup.object().shape(Object.assign({
    title: yup.string().required().max(5000).default(''),
    content: yup.string().required().default('')
}, BaseSchema));

const CreateNoteSchema = NoteSchema.pick(['title', 'content']);

module.exports = {
    NoteSchema,
    CreateNoteSchema,
    UpdateNoteSchema: CreateNoteSchema
}
