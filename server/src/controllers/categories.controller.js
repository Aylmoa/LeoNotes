import { db } from '../db/index.js'
import { categories } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, req.user.id))
      .orderBy(categories.name)

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
export const getCategoryById = async (req, res) => {
  try {
    const [category] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, req.params.id),
          eq(categories.userId, req.user.id)
        )
      )
      .limit(1)

    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json(category)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
       
// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const [category] = await db
      .insert(categories)
      .values({ name, userId: req.user.id })
      .returning()

    res.status(201).json(category)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const [existing] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, req.params.id),
          eq(categories.userId, req.user.id)
        )
      )
      .limit(1)

    if (!existing) {
      return res.status(404).json({ error: 'Category not found' })
    }

    await db
      .delete(categories)
      .where(eq(categories.id, req.params.id))

    res.json({ message: 'Category deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}