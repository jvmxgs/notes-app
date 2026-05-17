# Feature: Notes

## Goal

Allow users to create, view, update, delete, and search notes.

---

# Entity

A note has:

* id: string
* title: string
* content: string
* favorite: boolean
* createdAt: string

---

# Use Case: Create Note

## Input

* title: string
* content: string

## Rules

* title is required
* title must be at least 3 characters
* title must be unique
* content can be empty

---

## Desktop Behavior

* The create form replaces the "Add Note" button
* When the form is shown, focus the title input.
* Pressing Escape closes the form
* If the form contains data and Escape is pressed or the cancel button is pressed:
  * dont discard the note.
  * Show a confirmation dialog
* If the form is empty and Escape is pressed or the cancel button is pressed
  * discard the note inmediatly.
  * dont show a confirmation dialog
---

## Mobile Behavior

* The form opens in fullscreen mode
* If the mobile back action is triggered:
  * close immediately if the form is empty
  * show discard confirmation if the form contains data

---

## Expected Behavior

* A new note is created
* favorite is false by default
* createdAt is generated automatically
* The note is persisted to localStorage using the `VITE_STORAGE_KEY` environment variable
* Inputs are cleared after creation
* The created note is returned
* The new note appears with a UI animation

---

# Use Case: Get Notes

## Expected Behavior

* Returns all notes
* If there are no notes, returns an empty array

---

# Use Case: Select Note

## Input

* id: string

## Rules

* The note must exist

## Expected Behavior

* The selected note becomes active
* The note content is displayed in the detail panel on desktop
* The note content is expanded or opened on mobile

### Detail view

* The detail panel should display the selected note in read-only mode by default
* A visible `Edit` button must be present in the detail panel
* Clicking `Edit` opens editable fields (title, content) and shows `Save` and `Cancel` controls
* `Cancel` reverts any unsaved changes and returns to read-only mode
* `Save` validates and updates the note, then returns to read-only mode

---

# Use Case: Update Note

## Input

* id: string
* title?: string
* content?: string
* favorite?: boolean

## Rules

* The note must exist
* Only provided fields are updated
* Updated title must remain unique
* Updated title must contain at least 3 characters

## Expected Behavior

* The note is updated
* The updated note is returned

---

# Use Case: Delete Note

## Input

* id: string

## Rules

* If the note does not exist, do nothing
* Always ask for confirmation before deleting

## Expected Behavior

* A confirmation dialog is shown
* If confirmed:
  * the note is removed
  * the note disappears with animation
* If canceled:
  * the note remains unchanged

---

# Use Case: Search Notes

## Input

* query: string

## Rules

* Search by title and content
* Search is case insensitive

## Expected Behavior

* Returns matching notes
