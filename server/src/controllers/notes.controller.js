import { db } from '../db/index.js'
import { notes } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

// GET /api/notes
export const getNotes = async (req, res) => {
  try {
    const { categoryId } = req.query

    const conditions = [eq(notes.userId, req.user.id)]

    if (categoryId) {
      conditions.push(eq(notes.categoryId, categoryId))
    }

    const result = await db
      .select()
      .from(notes)
      .where(and(...conditions))
      .orderBy(notes.createdAt)

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /api/notes/:id
export const getNoteById = async (req, res) => {
  try {
    const [note] = await db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.id, req.params.id),
          eq(notes.userId, req.user.id)
        )
      )
      .limit(1)

    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }

    res.json(note)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// POST /api/notes
export const createNote = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const [note] = await db
      .insert(notes)
      .values({
        title,
        content: content ?? '',
        categoryId: categoryId ?? null,
        userId: req.user.id,
      })
      .returning()

    res.status(201).json(note)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// PUT /api/notes/:id
export const updateNote = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body

    const [existing] = await db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.id, req.params.id),
          eq(notes.userId, req.user.id)
        )
      )
      .limit(1)

    if (!existing) {
      return res.status(404).json({ error: 'Note not found' })
    }

    const [updated] = await db
      .update(notes)
      .set({
        title:      title      ?? existing.title,
        content:    content    ?? existing.content,
        categoryId: categoryId ?? existing.categoryId,
        updatedAt:  new Date(),
      })
      .where(eq(notes.id, req.params.id))
      .returning()

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const [existing] = await db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.id, req.params.id),
          eq(notes.userId, req.user.id)
        )
      )
      .limit(1)

    if (!existing) {
      return res.status(404).json({ error: 'Note not found' })
    }

    await db
      .delete(notes)
      .where(eq(notes.id, req.params.id))

    res.json({ message: 'Note deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}