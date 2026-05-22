import { Router } from 'express'
import { requireAuth } from '../middlewares/requireAuth.js'
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notes.controller.js'

const router = Router()

router.use(requireAuth) // protege todas las rutas de este router

router.get('/',     getNotes)
router.get('/:id',  getNoteById)
router.post('/',    createNote)
router.put('/:id',  updateNote)
router.delete('/:id', deleteNote)

export default router