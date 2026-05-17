<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNotes } from './composables/useNotes'
import NotesList from './components/NotesList.vue'
import NoteDetail from './components/NoteDetail.vue'
import type { Note } from './interfaces/note'

const { notes, deleteNote } = useNotes()

const selectedNoteId = ref<string | null>(null)
const searchQuery = ref('')
const isCreateOpen = ref(false)

const filteredNotes = computed(() => {
  if (!searchQuery.value.trim()) {
    return notes.value
  }

  const query = searchQuery.value.toLowerCase()
  return notes.value.filter(note =>
    note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query),
  )
})

const selectedNote = computed<Note | null>(() => {
  return notes.value.find(note => note.id === selectedNoteId.value) ?? null
})

const handleNoteCreated = (note: Note) => {
  selectedNoteId.value = note.id
  isCreateOpen.value = false
}

const handleSelectNote = (id: string) => {
  selectedNoteId.value = id
}

const handleDeleteNote = (id: string) => {
  deleteNote(id)
  if (selectedNoteId.value === id) {
    selectedNoteId.value = null
  }
}

const handleUpdateSearch = (value: string) => {
  searchQuery.value = value
}

</script>

<template>
  <div id="app" class="min-h-screen bg-gray-100 text-slate-900">
    <header class="bg-white/95 backdrop-blur-xl border-b border-slate-200 px-5 py-6 shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">Notes</h1>
          <p class="mt-1 text-sm text-slate-500">Create, manage, and review your notes quickly.</p>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-5 lg:grid lg:grid-cols-[320px_1fr] lg:gap-6">
      <NotesList
        :notes="filteredNotes"
        :selected-note-id="selectedNoteId"
        :search-query="searchQuery"
        :is-create-open="isCreateOpen"
        @toggle-create="isCreateOpen = !isCreateOpen"
        @close-create="isCreateOpen = false"
        @note-created="handleNoteCreated"
        @select-note="handleSelectNote"
        @delete-note="handleDeleteNote"
        @update-search="handleUpdateSearch"
      />

      <NoteDetail :note="selectedNote" />
    </main>
  </div>
</template>
