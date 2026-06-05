<template>
  <div class="w-72 bg-white border-r border-gray-200 flex flex-col overflow-hidden">

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center text-gray-400 text-sm">
      Loading...
    </div>

    <!-- Empty -->
    <div
      v-else-if="notes.length === 0"
      class="flex-1 flex items-center justify-center text-gray-400 text-sm text-center px-6"
    >
      No notes yet.<br>Click "+ New Note" to get started.
    </div>

    <!-- List -->
    <ul v-else class="flex-1 overflow-y-auto divide-y divide-gray-100">
      <li
        v-for="note in notes"
        :key="note.id"
        @click="$emit('select', note)"
        :class="[
          'px-4 py-3 cursor-pointer hover:bg-gray-50 transition group relative',
          selectedId === note.id ? 'bg-indigo-50 border-l-2 border-indigo-500' : ''
        ]"
      >
        <p class="text-sm font-medium text-gray-800 truncate pr-6">
          {{ note.title || 'Untitled' }}
        </p>
        <p class="text-xs text-gray-400 truncate mt-0.5">
          {{ note.content || 'No content' }}
        </p>
        <p class="text-xs text-gray-300 mt-1">
          {{ formatDate(note.updatedAt) }}
        </p>

        <!-- Delete button -->
        <button
          @click.stop="$emit('delete', note.id)"
          class="absolute right-3 top-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition text-lg leading-none"
        >
          ×
        </button>
      </li>
    </ul>

  </div>
</template>

<script setup>
defineProps({
  notes:      { type: Array,  default: () => [] },
  loading:    { type: Boolean, default: false },
  selectedId: { type: String,  default: null },
})

defineEmits(['select', 'delete'])

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
  })
}
</script>