<script setup lang="ts">
import { useNotes } from '../composables/useNotes'

const { notes } = useNotes()

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="max-w-2xl mx-auto mt-10 p-5">
    <h2 class="text-gray-800">Notes ({{ notes.length }})</h2>

    <div v-if="notes.length === 0" class="text-center text-gray-600 py-10 px-5">
      <p>No notes yet. Create your first note above!</p>
    </div>

    <div v-else class="flex flex-col gap-3.75">
      <div v-for="note in notes" :key="note.id" class="p-3.75 border border-gray-300 rounded bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h3 class="m-0 mb-2.5 text-gray-800 text-lg">{{ note.title }}</h3>
        <p class="m-0 mb-2.5 text-gray-600 leading-6 whitespace-pre-wrap break-words">{{ note.content || '(No content)' }}</p>
        <div class="flex justify-between items-center text-xs text-gray-600">
          <span class="italic">{{ formatDate(note.createdAt) }}</span>
          <span v-if="note.favorite" class="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-xs">⭐ Favorite</span>
        </div>
      </div>
    </div>
  </div>
</template>
