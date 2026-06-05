<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">

    <!-- Logo -->
    <div class="px-6 py-5 border-b border-gray-200">
      <h2 class="text-xl font-bold text-indigo-600">📝 Notely</h2>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-4 overflow-y-auto space-y-1">

      <!-- All notes -->
      <button
        @click="$emit('select-category', null)"
        :class="[
          'w-full text-left px-3 py-2 rounded-lg text-sm transition',
          !selectedCategory
            ? 'bg-indigo-50 text-indigo-700 font-medium'
            : 'text-gray-600 hover:bg-gray-100'
        ]"
      >
        All Notes
      </button>

      <!-- Categories -->
      <div class="pt-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Categories
        </p>

        <button
          v-for="category in categories"
          :key="category.id"
          @click="$emit('select-category', category)"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg text-sm transition',
            selectedCategory?.id === category.id
              ? 'bg-indigo-50 text-indigo-700 font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ category.name }}
        </button>

        <!-- New category input -->
        <div v-if="addingCategory" class="mt-2 px-1">
          <input
            v-model="newCategoryName"
            @keyup.enter="submitCategory"
            @keyup.esc="addingCategory = false"
            ref="categoryInput"
            type="text"
            placeholder="Category name..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div class="flex gap-2 mt-2">
            <button
              @click="submitCategory"
              class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium py-1.5 rounded-lg transition"
            >
              Add
            </button>
            <button
              @click="addingCategory = false"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium py-1.5 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>

        <button
          v-else
          @click="startAddingCategory"
          class="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-indigo-600 transition"
        >
          + Add category
        </button>
      </div>

    </nav>

    <!-- User + logout -->
    <div class="px-4 py-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
            {{ userInitial }}
          </div>
          <span class="text-sm text-gray-700 truncate">{{ authStore.user?.name }}</span>
        </div>
        <button
          @click="$emit('logout')"
          class="text-xs text-gray-400 hover:text-red-500 transition shrink-0 ml-2"
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

const props = defineProps({
  categories:       { type: Array,  default: () => [] },
  selectedCategory: { type: Object, default: null },
})

//defineEmits(['select-category', 'create-category', 'logout'])

const authStore        = useAuthStore()
const addingCategory   = ref(false)
const newCategoryName  = ref('')
const categoryInput    = ref(null)

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

// necesitamos emit para usarlo en submitCategory
const emit = defineEmits(['select-category', 'create-category', 'logout'])
</script>