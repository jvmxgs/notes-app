<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, nextTick } from 'vue'
import Swal from 'sweetalert2'
import { useNotes } from '../composables/useNotes'
import type { Note } from '../interfaces/note'

const props = defineProps<{ open?: boolean }>()
const emit = defineEmits<{
  (event: 'created', note: Note): void
  (event: 'cancel'): void
}>()

const { createNote } = useNotes()

const title = ref('')
const content = ref('')
const error = ref('')
const titleRef = ref<HTMLInputElement | null>(null)
let historyStatePushed = false
let ignorePopState = false

const resetForm = () => {
  title.value = ''
  content.value = ''
  error.value = ''
}

const discard = () => {
  cleanupHistoryState()
  resetForm()
  emit('cancel')
}

const handleSubmit = () => {
  error.value = ''

  try {
    const note = createNote(title.value, content.value)
    cleanupHistoryState()
    resetForm()
    emit('created', note)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create note'
  }
}

const handleCancel = async () => {
  if (!title.value.trim() && !content.value.trim()) {
    discard()
    return
  }

  const result = await Swal.fire({
    title: 'Discard note?',
    text: 'You have unsaved changes. Do you want to discard this note?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Discard',
    cancelButtonText: 'Keep editing',
    reverseButtons: true,
  })

  if (result.isConfirmed) {
    discard()
  }
}

const handleEscape = async (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    await handleCancel()
  }
}

const isMobile = () => window.innerWidth < 1024

const handlePopState = async () => {
  if (!isMobile() || ignorePopState) {
    return
  }

  if (!title.value.trim() && !content.value.trim()) {
    discard()
    return
  }

  const result = await Swal.fire({
    title: 'Discard note?',
    text: 'You have unsaved changes. Do you want to discard this note?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Discard',
    cancelButtonText: 'Keep editing',
    reverseButtons: true,
  })

  if (result.isConfirmed) {
    discard()
  } else {
    ignorePopState = true
    window.history.pushState({ createNote: true }, '')
    ignorePopState = false
  }
}

const pushHistoryState = () => {
  if (!historyStatePushed && isMobile()) {
    window.history.pushState({ createNote: true }, '')
    historyStatePushed = true
  }
}

const cleanupHistoryState = () => {
  if (!historyStatePushed) {
    return
  }

  ignorePopState = true
  window.history.back()
  ignorePopState = false
  historyStatePushed = false
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
  window.addEventListener('popstate', handlePopState)
  pushHistoryState()
  nextTick(() => titleRef.value?.focus())
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
  window.removeEventListener('popstate', handlePopState)
  cleanupHistoryState()
})
</script>

<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:relative lg:mt-0" :class="props.open ? 'fixed inset-0 z-30 m-4 overflow-auto lg:static lg:m-0' : ''">
    <div class="flex items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h3 class="text-lg font-semibold text-slate-900">Add note</h3>
        <p class="text-sm text-slate-500">Write a title and body for your note.</p>
      </div>
      <button
        type="button"
        @click="handleCancel"
        class="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-sm text-slate-600 transition hover:bg-slate-50 lg:hidden"
      >
        Cancel
      </button>
    </div>

    <div class="mt-4 space-y-4">
      <div>
        <label for="note-title" class="block text-sm font-medium text-slate-700">Title</label>
        <input
          id="note-title"
          ref="titleRef"
          v-model="title"
          type="text"
          placeholder="Note title"
          class="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:bg-white"
          required
        />
      </div>

      <div>
        <label for="note-content" class="block text-sm font-medium text-slate-700">Body</label>
        <textarea
          id="note-content"
          v-model="content"
          rows="5"
          placeholder="Write your note here..."
          class="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:bg-white"
        ></textarea>
      </div>

      <div v-if="error" class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
        {{ error }}
      </div>

      <div class="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          @click="handleCancel"
          class="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSubmit"
          class="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Add Note
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 1023px) {
  .fixed.inset-0 {
    background: rgba(255, 255, 255, 0.98);
  }
}
</style>
