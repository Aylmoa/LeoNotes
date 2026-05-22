import { db } from '../db/index.js'
import { tags, notesToTags } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

// GET /api/tags
export const getTags = async (req, res) => {
  try {
    const result = await db
      .select()
      .from(tags)
      .where(eq(tags.userId, req.user.id))
      .orderBy(tags.name)

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// POST /api/tags
export const createTag = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const [tag] = await db
      .insert(tags)
      .values({ name, userId: req.user.id })
      .returning()

    res.status(201).json(tag)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// DELETE /api/tags/:id
export const deleteTag = async (req, res) => {
  try {
    const [existing] = await db
      .select()
      .from(tags)
      .where(
        and(
          eq(tags.id, req.params.id),
          eq(tags.userId, req.user.id)
        )
      )
      .limit(1)

    if (!existing) {
      return res.status(404).json({ error: 'Tag not found' })
    }

    // Elimina primero las relaciones nota-tag
    await db
      .delete(notesToTags)
      .where(eq(notesToTags.tagId, req.params.id))

    await db
      .delete(tags)
      .where(eq(tags.id, req.params.id))

    res.json({ message: 'Tag deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// POST /api/tags/:tagId/notes/:noteId  asign tag to note
export const addTagToNote = async (req, res) => {
  try {
    const { tagId, noteId } = req.params

    await db
      .insert(notesToTags)
      .values({ tagId, noteId })
      .onConflictDoNothing()

    res.status(201).json({ message: 'Tag added to note' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// DELETE /api/tags/:tagId/notes/:noteId  remove tag from note
export const removeTagFromNote = async (req, res) => {
  try {
    const { tagId, noteId } = req.params

    await db
      .delete(notesToTags)
      .where(
        and(
          eq(notesToTags.tagId, tagId),
          eq(notesToTags.noteId, noteId)
        )
      )

    res.json({ message: 'Tag removed from note' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}