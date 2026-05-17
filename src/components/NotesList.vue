<script setup lang="ts">
import type { Note } from '../interfaces/note'
import { useNotes } from '../composables/useNotes'
import Swal from 'sweetalert2'

const { notes, updateNote, deleteNote } = useNotes()

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const confirmDelete = async (id: string): Promise<void> => {
  const result = await Swal.fire({
    title: 'Delete note? ',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  })

  if (result.isConfirmed) {
    deleteNote(id)
    await Swal.fire({
      title: 'Deleted!',
      text: 'Your note has been deleted.',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false,
    })
  }
}

const editNote = async (note: Note): Promise<void> => {
  const result = await Swal.fire<{ title: string; content: string }>({
    title: 'Edit note',
    html: `
      <input id="swal-title" class="swal2-input" placeholder="Title" value="${escapeHtml(note.title)}" />
      <textarea id="swal-content" class="swal2-textarea" placeholder="Content">${escapeHtml(note.content)}</textarea>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Save',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const titleInput = (document.getElementById('swal-title') as HTMLInputElement)?.value || ''
      const contentInput = (document.getElementById('swal-content') as HTMLTextAreaElement)?.value || ''
      return { title: titleInput, content: contentInput }
    },
  })

  if (!result.isConfirmed || !result.value) {
    return
  }

  try {
    updateNote(note.id, {
      title: result.value.title,
      content: result.value.content,
    })
    await Swal.fire({
      title: 'Saved!',
      text: 'Your note has been updated.',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false,
    })
  } catch (err) {
    await Swal.fire({
      title: 'Unable to save',
      text: err instanceof Error ? err.message : 'Failed to update note',
      icon: 'error',
    })
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto mt-10 p-5">
    <h2 class="text-gray-800">Notes ({{ notes.length }})</h2>

    <div v-if="notes.length === 0" class="text-center text-gray-600 py-10 px-5">
      <p>No notes yet. Create your first note above!</p>
    </div>

    <transition-group name="note" tag="div" class="flex flex-col gap-3.75">
      <div v-for="note in notes" :key="note.id" class="note-item p-3.75 border border-gray-300 rounded bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div class="flex justify-between items-start gap-3">
          <div>
            <h3 class="m-0 mb-2.5 text-gray-800 text-lg">{{ note.title }}</h3>
            <p class="m-0 mb-2.5 text-gray-600 leading-6 whitespace-pre-wrap break-words">{{ note.content || '(No content)' }}</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="editNote(note)"
              class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold"
            >
              <i class="pi pi-pencil" aria-hidden="true"></i>
              Edit
            </button>
            <button
              type="button"
              @click="confirmDelete(note.id)"
              class="inline-flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-semibold"
            >
              <i class="pi pi-trash" aria-hidden="true"></i>
              Delete
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center text-xs text-gray-600">
          <span class="italic">{{ formatDate(note.createdAt) }}</span>
          <span v-if="note.favorite" class="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-xs">⭐ Favorite</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.note-enter-from,
.note-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.note-enter-active,
.note-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.note-leave-active {
  position: relative;
}
.note-item {
  transform-origin: top center;
}
</style>
