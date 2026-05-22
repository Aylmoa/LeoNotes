import { Router } from 'express'
import { requireAuth } from '../middlewares/requireAuth.js'
import {
  getCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
} from '../controllers/categories.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/',     getCategories)
router.get('/:id',  getCategoryById)
router.post('/',    createCategory)
router.delete('/:id', deleteCategory)

export default router