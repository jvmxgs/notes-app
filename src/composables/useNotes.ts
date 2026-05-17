import { ref, watch } from 'vue'
import type { Note } from '../interfaces/note'

const notes = ref<Note[]>([])
let initialized = false

const STORAGE_KEY = (import.meta.env.VITE_STORAGE_KEY as string) || 'notes-app-notes'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Note[]
      if (Array.isArray(parsed)) {
        notes.value = parsed
      }
    }
  } catch (e) {
    // ignore parse errors
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
  } catch (e) {
    // ignore quota errors
  }
}

export function useNotes() {
  if (!initialized) {
    loadFromStorage()
    watch(notes, () => saveToStorage(), { deep: true })
    initialized = true
  }
  /**
   * Validates if a title is valid
   */
  function validateTitle(title: string, currentId?: string): { valid: boolean; error?: string } {
    if (!title || !title.trim()) {
      return { valid: false, error: 'Title is required' }
    }

    if (title.trim().length < 3) {
      return { valid: false, error: 'Title must be at least 3 characters' }
    }

    // Check if title is unique, excluding the current note when editing
    const normalizedTitle = title.trim().toLowerCase()
    if (
      notes.value.some(
        note => note.title.toLowerCase() === normalizedTitle && note.id !== currentId,
      )
    ) {
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
   * Updates an existing note
   * @param id - The note id
   * @param updates - Partial note fields to update
   */
  function updateNote(
    id: string,
    updates: { title?: string; content?: string; favorite?: boolean },
  ): Note | undefined {
    const note = notes.value.find(n => n.id === id)
    if (!note) {
      return undefined
    }

    if (updates.title !== undefined) {
      const titleValidation = validateTitle(updates.title, id)
      if (!titleValidation.valid) {
        throw new Error(titleValidation.error)
      }
      note.title = updates.title.trim()
    }

    if (updates.content !== undefined) {
      note.content = updates.content.trim()
    }

    if (updates.favorite !== undefined) {
      note.favorite = updates.favorite
    }

    return note
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
    updateNote,
    deleteNote,
  }
}
