import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios.js'

export const useNotesStore = defineStore('notes', () => {
  const notes      = ref([])
  const categories = ref([])
  const tags       = ref([])
  const loading    = ref(false)

  const fetchNotes = async (categoryId = null) => {
    loading.value = true
    const params = categoryId ? { categoryId } : {}
    const { data } = await api.get('/notes', { params })
    notes.value = data
    loading.value = false
  }

  const fetchCategories = async () => {
    const { data } = await api.get('/categories')
    categories.value = data
  }

  const fetchTags = async () => {
    const { data } = await api.get('/tags')
    tags.value = data
  }

  const createNote = async (payload) => {
    const { data } = await api.post('/notes', payload)
    notes.value.unshift(data)
    return data
  }

  const updateNote = async (id, payload) => {
    const { data } = await api.put(`/notes/${id}`, payload)
    const index = notes.value.findIndex((n) => n.id === id)
    if (index !== -1) notes.value[index] = data
    return data
  }

  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}`)
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  const createCategory = async (name) => {
    const { data } = await api.post('/categories', { name })
    categories.value.push(data)
    return data
  }

  return {
    notes, categories, tags, loading,
    fetchNotes, fetchCategories, fetchTags,
    createNote, updateNote, deleteNote, createCategory,
  }
})