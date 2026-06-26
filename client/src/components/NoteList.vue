<template>
  <div class="w-72 bg-base-800 border-r border-base-600 flex flex-col overflow-hidden">

    <div v-if="loading" class="flex-1 flex items-center justify-center text-base-400 text-sm">
      Loading...
    </div>

    <div
      v-else-if="notes.length === 0"
      class="flex-1 flex flex-col items-center justify-center text-base-400 text-sm text-center px-6 gap-2"
    >
      <span class="text-3xl">◻</span>
      No notes yet.<br>Click "+ New Note" to start.
    </div>

    <ul v-else class="flex-1 overflow-y-auto">
      <li
        v-for="note in notes"
        :key="note.id"
        @click="$emit('select', note)"
        :class="[
          'px-4 py-3.5 cursor-pointer transition group relative border-b border-base-600',
          selectedId === note.id
            ? 'bg-violet-500/10 border-l-2 border-l-violet-500'
            : 'hover:bg-base-700'
        ]"
      >
        <p class="text-sm font-semibold text-white truncate pr-6">
          {{ note.title || 'Untitled' }}
        </p>
        <p class="text-xs text-base-400 truncate mt-0.5">
          {{ note.content || 'No content' }}
        </p>
        <p class="text-xs text-base-500 mt-1.5">
          {{ formatDate(note.updatedAt) }}
        </p>

        <button
          @click.stop="$emit('delete', note.id)"
          class="absolute right-3 top-3 text-base-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition text-lg leading-none"
        >
          ×
        </button>
      </li>
    </ul>

  </div>
</template>

<script setup>
defineProps({
  notes:      { type: Array,   default: () => [] },
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