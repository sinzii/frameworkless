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
