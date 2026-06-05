<template>
  <div class="flex-1 flex flex-col bg-white overflow-hidden">

    <!-- Editor header -->
    <div class="px-8 pt-8 pb-4 border-b border-gray-100">

      <!-- Title -->
      <input
        v-model="localTitle"
        @input="scheduleAutosave"
        type="text"
        placeholder="Untitled"
        class="w-full text-2xl font-bold text-gray-800 placeholder-gray-300 focus:outline-none bg-transparent"
      />

      <!-- Category selector -->
      <div class="flex items-center gap-3 mt-3">
        <select
          v-model="localCategoryId"
          @change="scheduleAutosave"
          class="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option :value="null">No category</option>
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>

        <!-- Autosave indicator -->
        <span class="text-xs text-gray-300">
          {{ saveStatus }}
        </span>
      </div>

    </div>

    <!-- Content area -->
    <textarea
      v-model="localContent"
      @input="scheduleAutosave"
      placeholder="Start writing..."
      class="flex-1 px-8 py-6 text-gray-700 text-sm leading-relaxed resize-none focus:outline-none placeholder-gray-300"
    />

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  note:       { type: Object, required: true },
  categories: { type: Array,  default: () => [] },
})

const emit = defineEmits(['save'])

const localTitle      = ref(props.note.title)
const localContent    = ref(props.note.content)
const localCategoryId = ref(props.note.categoryId)
const saveStatus      = ref('')
let   autosaveTimer   = null

// Sync cuando cambia la nota seleccionada
watch(() => props.note, (newNote) => {
  localTitle.value      = newNote.title
  localContent.value    = newNote.content
  localCategoryId.value = newNote.categoryId
  saveStatus.value      = ''
})

const scheduleAutosave = () => {
  saveStatus.value = 'Saving...'
  clearTimeout(autosaveTimer)
  autosaveTimer = setTimeout(async () => {
    await emit('save', {
      title:      localTitle.value,
      content:    localContent.value,
      categoryId: localCategoryId.value,
    })
    saveStatus.value = 'Saved ✓'
    setTimeout(() => (saveStatus.value = ''), 2000)
  }, 800) // guarda 800ms después de que el usuario deja de escribir
}
</script>