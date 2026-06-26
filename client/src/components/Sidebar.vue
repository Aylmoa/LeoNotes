<template>
  <aside class="w-64 bg-base-800 border-r border-base-600 flex flex-col">

    <!-- Logo -->
    <div class="px-6 py-5 border-b border-base-600">
      <h2 class="text-lg font-bold gradient-text tracking-tight">✦ Notely</h2>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">

      <button
        @click="$emit('select-category', null)"
        :class="[
          'w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2',
          !selectedCategory
            ? 'bg-violet-500/15 text-violet-300 font-medium'
            : 'text-base-400 hover:bg-base-600 hover:text-white'
        ]"
      >
        <span class="text-base">◈</span> All Notes
      </button>

      <div class="pt-5">
        <p class="text-xs font-semibold text-base-400 uppercase tracking-widest px-3 mb-2">
          Categories
        </p>

        <button
          v-for="category in categories"
          :key="category.id"
          @click="$emit('select-category', category)"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2',
            selectedCategory?.id === category.id
              ? 'bg-violet-500/15 text-violet-300 font-medium'
              : 'text-base-400 hover:bg-base-600 hover:text-white'
          ]"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
          {{ category.name }}
        </button>

        <!-- New category -->
        <div v-if="addingCategory" class="mt-2 px-1">
          <input
            v-model="newCategoryName"
            @keyup.enter="submitCategory"
            @keyup.esc="addingCategory = false"
            ref="categoryInput"
            type="text"
            placeholder="Category name..."
            class="w-full bg-base-700 border border-base-500 rounded-lg px-3 py-2 text-sm text-white placeholder-base-400 focus:outline-none focus:border-violet-500 transition"
          />
          <div class="flex gap-2 mt-2">
            <button
              @click="submitCategory"
              class="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium py-1.5 rounded-lg transition"
            >
              Add
            </button>
            <button
              @click="addingCategory = false"
              class="flex-1 bg-base-600 hover:bg-base-500 text-base-300 text-xs font-medium py-1.5 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>

        <button
          v-else
          @click="startAddingCategory"
          class="w-full text-left px-3 py-2 text-sm text-base-400 hover:text-violet-400 transition mt-1"
        >
          + Add category
        </button>
      </div>

    </nav>

    <!-- User -->
    <div class="px-4 py-4 border-t border-base-600">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {{ userInitial }}
          </div>
          <span class="text-sm text-base-300 truncate">{{ authStore.user?.name }}</span>
        </div>
        <button
          @click="$emit('logout')"
          class="text-xs text-base-400 hover:text-red-400 transition shrink-0 ml-2"
        >
          Logout
        </button>
      </div>
    </div>

  </aside>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth.store.js'

defineProps({
  categories:       { type: Array,  default: () => [] },
  selectedCategory: { type: Object, default: null },
})

const emit = defineEmits(['select-category', 'create-category', 'logout'])

const authStore       = useAuthStore()
const addingCategory  = ref(false)
const newCategoryName = ref('')
const categoryInput   = ref(null)

const userInitial = computed(() =>
  authStore.user?.name?.charAt(0).toUpperCase() ?? '?'
)

const startAddingCategory = async () => {
  addingCategory.value  = true
  newCategoryName.value = ''
  await nextTick()
  categoryInput.value?.focus()
}

const submitCategory = () => {
  const name = newCategoryName.value.trim()
  if (!name) return
  emit('create-category', name)
  addingCategory.value  = false
  newCategoryName.value = ''
}
</script>