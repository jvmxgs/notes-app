# Notes UI

## General Style

- The application should feel minimal, modern, and clean
- Use neutral colors with subtle contrast
- Use rounded corners on cards, inputs, and buttons
- Use soft shadows with low opacity
- Spacing should feel comfortable and breathable
- Animations should feel smooth and lightweight
- Typography should prioritize readability

---

# Desktop Layout

## Structure

- Use a two-column layout

### Left Column

The left column should contain:

- A button to create a new note at the top
- A vertical list of note titles below the button

### Right Column

The right column should display:

- The selected note title
- The selected note body

If no note is selected, show an empty placeholder state.

---

## Note List

- Notes should appear as compact clickable items
- The active note should have a subtle highlighted background
- Hovering a note should slightly change its background color
- Long titles should truncate with ellipsis

---

## Create Note Form

### Initial State

- Show only the "Add Note" button

### Expanded State

When the user clicks the button:

- Replace the button with the create note form
- The form should contain:
  - Title input
  - Body textarea
  - Cancel button
  - Add Note button

### Escape Key Behavior

When the escape key is pressed:

- Close the form
- Restore the "Add Note" button

If the form already contains data:

- Do not show a confirmation dialog
- Discard the note immediately

---

## Animations

### Opening Form

- The form should fade and slide into view

### Closing Form

- The form should fade out smoothly

### Adding Note

When a note is added:

- Animate the new note appearing in the list
- Close the form with a smooth transition
- Clear all input fields after creation

---

# Mobile Layout

## Structure

- Use a single-column layout
- Show only note titles in the main list
- Tapping a note should expand or open the note body

---

## Floating Action Button

- Show a floating action button at the bottom-right corner
- The button should remain visible while browsing notes
- The button should use a subtle shadow and rounded shape

---

## Mobile Create Form

When the floating button is pressed:

- Open a fullscreen note creation form
- The form should contain:
  - Title input
  - Body textarea
  - Cancel button
  - Add Note button

---

## Mobile Back Navigation

If the user presses the mobile back button:

### Empty Form

- Close the form immediately
- Return to the notes list

### Filled Form

- Show a confirmation dialog asking whether to discard the note

---

## Mobile Animations

### Opening Form

- Slide the form upward from the bottom

### Closing Form

- Slide the form downward

### Adding Note

- Animate the new note appearing in the notes list
