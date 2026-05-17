<script setup lang="ts">
import CreateNoteForm from './components/CreateNoteForm.vue'
import NotesList from './components/NotesList.vue'
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <header class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-7 shadow-md text-center">
      <h1 class="m-0 text-3xl font-bold">📝 Notes App</h1>
    </header>
    <main class="p-5">
      <CreateNoteForm />
      <NotesList />
    </main>
  </div>
</template>
