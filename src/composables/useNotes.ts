import { ref, watch } from 'vue'
import type { Note } from '../interfaces/note'

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'notes-app-notes'

function loadNotes(): Note[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored) as Note[]
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
  } catch {
    return []
  }
}

function saveNotes(notes: Note[]) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // Ignore localStorage write failures
  }
}

const notes = ref<Note[]>(loadNotes())

watch(notes, () => saveNotes(notes.value), { deep: true })

export function useNotes() {
  /**
   * Validates if a title is valid
   */
  function validateTitle(title: string): { valid: boolean; error?: string } {
    if (!title || !title.trim()) {
      return { valid: false, error: 'Title is required' }
    }

    if (title.trim().length < 3) {
      return { valid: false, error: 'Title must be at least 3 characters' }
    }

    // Check if title is unique
    if (notes.value.some(note => note.title.toLowerCase() === title.toLowerCase())) {
      return { valid: false, error: 'Title must be unique' }
    }

    return { valid: true }
  }

  /**
   * Creates a new note
   * @param title - The title of the note (required, min 3 chars, unique)
   * @param content - The content of the note (optional)
   * @returns The created note or throws an error
   */
  function createNote(title: string, content: string = ''): Note {
    const titleValidation = validateTitle(title)
    if (!titleValidation.valid) {
      throw new Error(titleValidation.error)
    }

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      favorite: false,
      createdAt: new Date().toISOString(),
    }

    notes.value.push(newNote)
    return newNote
  }

  /**
   * Gets all notes
   */
  function getNotes(): Note[] {
    return notes.value
  }

  /**
   * Deletes a note by id
   */
  function deleteNote(id: string): void {
    notes.value = notes.value.filter(note => note.id !== id)
  }

  return {
    notes,
    createNote,
    getNotes,
    deleteNote,
  }
}
