<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from '../interfaces/note'
import CreateNoteForm from './CreateNoteForm.vue'
import Swal from 'sweetalert2'

const props = defineProps<{
  notes: Note[]
  selectedNoteId: string | null
  searchQuery: string
  isCreateOpen: boolean
}>()

const emit = defineEmits<{
  (event: 'toggle-create'): void
  (event: 'close-create'): void
  (event: 'note-created', note: Note): void
  (event: 'select-note', id: string): void
  (event: 'delete-note', id: string): void
  (event: 'update-search', value: string): void
}>()

const filteredNotes = computed(() => props.notes)

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
    emit('delete-note', id)
    await Swal.fire({
      title: 'Deleted!',
      text: 'Your note has been deleted.',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false,
    })
  }
}

const handleCreate = (note: Note) => {
  emit('note-created', note)
}

const onSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update-search', target.value)
}
</script>

<template>
  <aside class="space-y-5">
    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm text-slate-500">Notes</p>
          <h2 class="text-xl font-semibold text-slate-900">My notes</h2>
        </div>
        <button
          v-if="!props.isCreateOpen"
          type="button"
          @click="$emit('toggle-create')"
          class="hidden lg:inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <i class="pi pi-plus"></i>
          Add note
        </button>
      </div>

      <div class="mt-4">
        <input
          type="text"
          :value="props.searchQuery"
          @input="onSearch"
          placeholder="Search notes"
          class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
      </div>
    </div>

    <transition name="fade-slide" mode="out-in">
      <CreateNoteForm
        v-if="props.isCreateOpen"
        @created="handleCreate"
        @cancel="$emit('close-create')"
      />
    </transition>

    <div class="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div class="flex items-center justify-between px-2 pb-3">
        <p class="text-sm font-semibold text-slate-900">Notes list</p>
        <span class="text-xs text-slate-500">{{ filteredNotes.length }}</span>
      </div>

      <div v-if="filteredNotes.length === 0" class="px-4 py-7 text-center text-sm text-slate-500">
        No notes found.
      </div>

      <transition-group name="note-item" tag="ul" class="space-y-2">
        <li
          v-for="note in filteredNotes"
          :key="note.id"
          @click="$emit('select-note', note.id)"
          :class="[
            'flex cursor-pointer items-center justify-between gap-3 rounded-3xl px-4 py-4 transition hover:bg-slate-50',
            props.selectedNoteId === note.id ? 'bg-slate-100' : 'bg-white',
          ]"
        >
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-slate-900">{{ note.title }}</p>
            <p class="truncate text-xs text-slate-500">{{ note.content || 'No content' }}</p>
          </div>
          <button
            type="button"
            @click.stop.prevent="confirmDelete(note.id)"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-red-600"
            aria-label="Delete note"
          >
            <i class="pi pi-trash"></i>
          </button>
        </li>
      </transition-group>
    </div>

    <button
      v-if="!props.isCreateOpen"
      @click="$emit('toggle-create')"
      class="fixed bottom-5 right-5 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 lg:hidden"
      aria-label="Add note"
    >
      <i class="pi pi-plus text-lg"></i>
    </button>
  </aside>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.note-item-enter-from,
.note-item-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.note-item-enter-active,
.note-item-leave-active {
  transition: all 0.2s ease;
}
</style>
