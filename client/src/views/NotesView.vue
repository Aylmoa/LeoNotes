<template>
  <div class="min-h-screen bg-gray-50 flex">

    <!-- Sidebar -->
    <Sidebar
      :categories="notesStore.categories"
      :selected-category="selectedCategory"
      @select-category="selectCategory"
      @create-category="handleCreateCategory"
      @logout="handleLogout"
    />

    <!-- Main content -->
    <div class="flex-1 flex flex-col">

      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 class="text-lg font-semibold text-gray-800">
          {{ selectedCategory ? selectedCategory.name : 'All Notes' }}
        </h1>
        <button
          @click="handleNewNote"
          class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + New Note
        </button>
      </header>

      <!-- Body -->
      <div class="flex-1 flex overflow-hidden">

        <!-- Note list -->
        <NoteList
          :notes="notesStore.notes"
          :loading="notesStore.loading"
          :selected-id="activeNote?.id"
          @select="selectNote"
          @delete="handleDeleteNote"
        />

        <!-- Note editor -->
        <NoteEditor
          v-if="activeNote"
          :note="activeNote"
          :categories="notesStore.categories"
          @save="handleSaveNote"
        />

        <!-- Empty state -->
        <div
          v-else
          class="flex-1 flex items-center justify-center text-gray-400 text-sm"
        >
          Select a note or create a new one
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '../stores/notes.store.js'
import { useAuthStore } from '../stores/auth.store.js'
import Sidebar from '../components/Sidebar.vue'
import NoteList from '../components/NoteList.vue'
import NoteEditor from '../components/NoteEditor.vue'

const router         = useRouter()
const notesStore     = useNotesStore()
const authStore      = useAuthStore()

const activeNote        = ref(null)
const selectedCategory  = ref(null)

onMounted(async () => {
  await Promise.all([
    notesStore.fetchNotes(),
    notesStore.fetchCategories(),
    notesStore.fetchTags(),
  ])
})

const selectCategory = async (category) => {
  selectedCategory.value = category
  activeNote.value = null
  await notesStore.fetchNotes(category?.id ?? null)
}

const selectNote = (note) => {
  activeNote.value = { ...note }
}

const handleNewNote = async () => {
  const note = await notesStore.createNote({
    title: 'Untitled',
    content: '',
    categoryId: selectedCategory.value?.id ?? null,
  })
  activeNote.value = { ...note }
}

const handleSaveNote = async (payload) => {
  const updated = await notesStore.updateNote(activeNote.value.id, payload)
  activeNote.value = { ...updated }
}

const handleDeleteNote = async (id) => {
  await notesStore.deleteNote(id)
  if (activeNote.value?.id === id) activeNote.value = null
}

const handleCreateCategory = async (name) => {
  await notesStore.createCategory(name)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>