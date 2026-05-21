<script setup lang="ts">
import { watch, ref } from 'vue'
import Swal from 'sweetalert2'
import type { Note } from '../interfaces/note'
import { useNotes } from '../composables/useNotes'

const props = defineProps<{ note: Note | null }>()

const { updateNote } = useNotes()

const title = ref('')
const content = ref('')
const favorite = ref(false)
const editing = ref(false)

watch(
  () => props.note,
  note => {
    if (note) {
      title.value = note.title
      content.value = note.content
      favorite.value = note.favorite
    } else {
      title.value = ''
      content.value = ''
      favorite.value = false
    }
  },
  { immediate: true },
)

const startEdit = () => {
  editing.value = true
}

const cancelEdit = () => {
  if (props.note) {
    title.value = props.note.title
    content.value = props.note.content
    favorite.value = props.note.favorite
  }
  editing.value = false
}

const handleSave = async () => {
  if (!props.note) {
    return
  }

  try {
    updateNote(props.note.id, {
      title: title.value,
      content: content.value,
      favorite: favorite.value,
    })

    editing.value = false

    await Swal.fire({
      title: 'Saved!',
      text: 'Your note has been updated.',
      icon: 'success',
      timer: 1300,
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

const toggleFavorite = async () => {
  if (!props.note) return
  try {
    updateNote(props.note.id, { favorite: !favorite.value })
    favorite.value = !favorite.value
  } catch (err) {
    await Swal.fire({
      title: 'Unable to update',
      text: err instanceof Error ? err.message : 'Failed to update favorite',
      icon: 'error',
    })
  }
}
</script>

<template>
  <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm min-h-[320px]">
    <div v-if="!props.note" class="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-500">
      <i class="pi pi-file-edit text-4xl"></i>
      <p class="text-lg font-semibold text-slate-900">Select a note to view details</p>
      <p class="max-w-sm text-sm">Choose a note from the list to see its title, body and favorite status.</p>
    </div>

    <div v-else class="space-y-5">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">Selected note</h2>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="!editing"
            type="button"
            @click="startEdit"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </button>

          <button
            type="button"
            @click="toggleFavorite"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <i :class="favorite ? 'pi pi-star text-amber-500' : 'pi pi-star-o'" aria-hidden="true"></i>
            {{ favorite ? 'Favorite' : 'Mark favorite' }}
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div v-if="!editing">
          <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
          <p class="mt-2 text-sm text-slate-700">{{ content || 'No content' }}</p>
        </div>

        <div v-else>
          <div>
            <label for="detail-title" class="block text-sm font-medium text-slate-700">Title</label>
            <input
              id="detail-title"
              v-model="title"
              type="text"
              placeholder="Note title"
              class="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div>
            <label for="detail-content" class="block text-sm font-medium text-slate-700">Body</label>
            <textarea
              id="detail-content"
              v-model="content"
              rows="8"
              placeholder="Note content"
              class="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:bg-white"
            ></textarea>
          </div>
        </div>
      </div>

      <div v-if="editing" class="flex gap-3">
        <button
          type="button"
          @click="cancelEdit"
          class="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSave"
          class="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Save changes
        </button>
      </div>
    </div>
  </section>
</template>
