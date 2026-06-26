<template>
  <div class="flex-1 flex flex-col bg-base-900 overflow-hidden">

    <!-- Editor header -->
    <div class="px-10 pt-10 pb-5 border-b border-base-700">
      <input
        v-model="localTitle"
        @input="scheduleAutosave"
        type="text"
        placeholder="Untitled"
        class="w-full text-3xl font-bold text-white placeholder-base-500 focus:outline-none bg-transparent"
      />

      <div class="flex items-center gap-3 mt-4">
        <select
          v-model="localCategoryId"
          @change="scheduleAutosave"
          class="text-xs text-base-300 bg-base-700 border border-base-500 rounded-lg px-3 py-1.5 focus:outline-none focus:border-violet-500 transition cursor-pointer"
        >
          <option :value="null">No category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <span
          v-if="saveStatus"
          class="text-xs text-violet-400 flex items-center gap-1"
        >
          <span v-if="saveStatus === 'Saving...'">⟳</span>
          <span v-else>✓</span>
          {{ saveStatus }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <textarea
      v-model="localContent"
      @input="scheduleAutosave"
      placeholder="Start writing..."
      class="flex-1 px-10 py-8 text-base-300 text-sm leading-relaxed resize-none focus:outline-none placeholder-base-500 bg-transparent"
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
    saveStatus.value = 'Saved'
    setTimeout(() => (saveStatus.value = ''), 2000)
  }, 800)
}
</script>