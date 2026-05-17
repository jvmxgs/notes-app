# Feature: Notes

## Goal

Allow users to create, view, update, delete and search notes.

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
* content can be empty
* title must be unique

## Expected Behavior

* A new note is created
* The note is stored in memory
* favorite is false by default
* createdAt is generated automatically
* The created note is returned

---

# Use Case: Get Notes

## Expected Behavior

* Returns all notes
* If there are no notes, returns an empty array

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
* Updated title must still be unique
* Updated title must have at least 3 characters

## Expected Behavior

* The note is updated
* Updated note is returned

---

# Use Case: Delete Note

## Input

* id: string

## Rules

* If the note does not exist, do nothing
* Ask the user to confirm before deleting the note

## Expected Behavior

* The user is shown a confirmation prompt before the note is deleted
* If the user confirms, the note is removed from the list
* If the user cancels, the note is not removed
* The note is removed with a visible UI animation, such as sliding up or fading out

---

# Use Case: Search Notes

## Input

* query: string

## Rules

* Search by title and content
* Search is case insensitive

## Expected Behavior

* Returns matching notes
