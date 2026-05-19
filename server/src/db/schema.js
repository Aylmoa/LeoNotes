import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id:        uuid('id').primaryKey().defaultRandom(),
  email:     text('email').notNull().unique(),
  password:  text('password').notNull(),
  name:      text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const categories = pgTable('categories', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      text('name').notNull(),
  userId:    uuid('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
})

export const tags = pgTable('tags', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      text('name').notNull(),
  userId:    uuid('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
})

export const notes = pgTable('notes', {
  id:         uuid('id').primaryKey().defaultRandom(),
  title:      text('title').notNull(),
  content:    text('content').default(''),
  userId:     uuid('user_id').notNull().references(() => users.id),
  categoryId: uuid('category_id').references(() => categories.id),
  createdAt:  timestamp('created_at').defaultNow(),
  updatedAt:  timestamp('updated_at').defaultNow(),
})

export const notesToTags = pgTable('notes_to_tags', {
  noteId: uuid('note_id').notNull().references(() => notes.id),
  tagId:  uuid('tag_id').notNull().references(() => tags.id),
})