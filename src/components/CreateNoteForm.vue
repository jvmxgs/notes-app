<script setup lang="ts">
import { ref } from 'vue'
import { useNotes } from '../composables/useNotes'

const { createNote } = useNotes()

const title = ref('')
const content = ref('')
const error = ref('')
const success = ref('')

const handleSubmit = () => {
  error.value = ''
  success.value = ''

  try {
    const note = createNote(title.value, content.value)
    success.value = `Note "${note.title}" created successfully!`
    title.value = ''
    content.value = ''

    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create note'
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="mt-0 mb-5 text-gray-800 text-xl font-semibold">Create a New Note</h2>

    <div v-if="error" class="p-3 mb-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">{{ error }}</div>
    <div v-if="success" class="p-3 mb-4 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm">{{ success }}</div>

    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="title" class="block mb-1.5 font-medium text-gray-700 text-sm">Title:</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Enter note title (min 3 characters)"
          class="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all duration-200 focus:outline-none focus:border-gray-600 focus:bg-white focus:shadow-sm"
          required
        />
      </div>

      <div class="mb-4">
        <label for="content" class="block mb-1.5 font-medium text-gray-700 text-sm">Content:</label>
        <textarea
          id="content"
          v-model="content"
          placeholder="Enter note content (optional)"
          rows="5"
          class="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all duration-200 focus:outline-none focus:border-gray-600 focus:bg-white focus:shadow-sm"
        ></textarea>
      </div>

      <button type="submit" class="w-full bg-gray-800 text-white p-3 border-none rounded-lg cursor-pointer text-sm font-semibold transition-all duration-200 hover:bg-black hover:shadow-lg active:scale-98">Create Note</button>
    </form>
  </div>
</template>
