# Application Rules

## Stack

* Use Vue 3
* Use Composition API
* Use TailwindCSS
* Use Vite
* Use Prime Icons
* Use SweetAlert2

---

# Architecture

* Keep the project simple
* Prefer composables for business logic
* Keep components focused on UI
* Avoid large components
* Keep shared TypeScript interfaces in `src/interfaces/`
* Separate layout components from note feature components

---

# State Management

* Use local component state or composables
* Do not use Pinia yet

---

# Responsive Behavior

## Desktop

* Use a two-column layout
* Left column:
  * add note section
  * notes list
* Right column:
  * selected note content

## Mobile

* Use a single-column layout
* Show note titles in the main list
* Open note content separately or expandable
* Use a floating action button for note creation
* Use fullscreen note creation form

---

# Styling

* Use Tailwind utility classes
* Avoid custom CSS unless necessary
* Prefer neutral colors
* Prefer rounded corners
* Prefer soft shadows
* Maintain comfortable spacing
* Keep the interface minimal and modern

---

# Animations

* Keep animations lightweight and smooth
* Animate:
  * opening forms
  * closing forms
  * note creation
  * note deletion
  * note selection transitions

---

# Accessibility

* Support keyboard navigation
* Escape key should close desktop forms
* Buttons should have hover and focus states
* Inputs should remain accessible on mobile devices

---

# Development Rules

* Implement features incrementally
* Follow the specs before coding
* Avoid unnecessary abstractions
* Prioritize readability over cleverness
* Prefer reusable UI components when repetition appears

---

# Current Scope

The current version supports:

* Creating notes
* Viewing notes
* Selecting notes
* Updating notes
* Deleting notes
* Searching notes

Persistence and backend are not implemented yet.
