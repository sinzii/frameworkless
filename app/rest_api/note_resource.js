const router = require('../router');
const { NoteService } = require('../services');

/**
 * Get all notes
 *
 * @param req
 * @param res
 */
const getNotes = async (req, res) => {
    const notes = await NoteService.find();

    res.sendJson(notes);
}

router.get('/api/note', getNotes);

/**
 * Get information of a note by id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getNote = async (req, res) => {
    const note = await NoteService.findById(req.params.id);

    res.sendJson(note);
}

router.get('/api/note/:id', getNote);

/**
 * Create new note
 *
 * @param req
 * @param res
 */
const newNote = async (req, res) => {
    const noteId = await NoteService.create(req.body, null);

    res.sendJson(await NoteService.findById(noteId));
}

router.post('/api/note', newNote);


/**
 * Update an existed note
 *
 * @param req
 * @param res
 */
const updateNote = async (req, res) => {
    const noteId = await NoteService.update(req.body, null);

    res.sendJson(await NoteService.findById(noteId));
}

router.put('/api/note', updateNote);
