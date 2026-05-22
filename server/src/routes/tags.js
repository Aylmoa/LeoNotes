import { Router } from 'express'
import { requireAuth } from '../middlewares/requireAuth.js'
import {
  getTags,
  createTag,
  deleteTag,
  addTagToNote,
  removeTagFromNote,
} from '../controllers/tags.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/',     getTags)
router.post('/',    createTag)
router.delete('/:id', deleteTag)

router.post('/:tagId/notes/:noteId',   addTagToNote)
router.delete('/:tagId/notes/:noteId', removeTagFromNote)

export default router