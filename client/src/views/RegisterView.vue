<template>
  <div class="min-h-screen bg-base-900 flex items-center justify-center p-4">

    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-20%] right-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
    </div>

    <div class="glass rounded-2xl w-full max-w-md p-8 relative z-10">

      <div class="mb-8">
        <h1 class="text-3xl font-bold gradient-text mb-1">Create account</h1>
        <p class="text-base-400 text-sm">Start organizing your thoughts</p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-base-400 uppercase tracking-wider mb-1.5">Name</label>
          <input
            v-model="name"
            type="text"
            placeholder="John Doe"
            class="w-full bg-base-800 border border-base-500 rounded-xl px-4 py-3 text-sm text-white placeholder-base-400 focus:outline-none focus:border-violet-500 transition"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-base-400 uppercase tracking-wider mb-1.5">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full bg-base-800 border border-base-500 rounded-xl px-4 py-3 text-sm text-white placeholder-base-400 focus:outline-none focus:border-violet-500 transition"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-base-400 uppercase tracking-wider mb-1.5">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full bg-base-800 border border-base-500 rounded-xl px-4 py-3 text-sm text-white placeholder-base-400 focus:outline-none focus:border-violet-500 transition"
          />
        </div>

        <p v-if="error" class="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {{ error }}
        </p>

        <button
          @click="handleRegister"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition shadow-glow disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {{ loading ? 'Creating account...' : 'Get started →' }}
        </button>
      </div>

      <p class="text-center text-sm text-base-400 mt-6">
        Already have an account?
        <RouterLink to="/login" class="text-violet-400 hover:text-violet-300 font-medium transition">
          Sign in
        </RouterLink>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store.js'

const router   = useRouter()
const auth     = useAuthStore()
const name     = ref('')
const email    = ref('')
const password = ref('')
const error    = ref('')
const loading  = ref(false)

const handleRegister = async () => {
  error.value   = ''
  loading.value = true
  try {
    await auth.register(name.value, email.value, password.value)
    router.push('/notes')
  } catch (err) {
    error.value = err.response?.data?.error || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>