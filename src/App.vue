<template>
  <div class="flex w-screen h-screen text-gray-700">
    <div v-if="isOffline" class="absolute top-0 left-0 opacity-75 z-10 w-full text-center py-2 bg-red-300 border-b border-red-500 text-red-800">
      Sorry, it looks like you're offline.
    </div>
    <div class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100">
      <!-- sidebar -->
      <div class="h-0 overflow-auto flex-grow">
        <div class="flex items-center h-8 px-3 group mt-4">
          <div class="flex items-center flex-grow focus:outline-none">
            <a href="#" @click.prevent="showAllNotes" class="ml-2 leading-none font-medium text-sm">
              All Notes
            </a>
          </div>
          <button class="add-note" @click.prevent="addNewNote">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
              </path>
            </svg>
          </button>
        </div>
        <div class="mt-4">
          <a v-for="note in notes" :key="note.created" href="#" @click.prevent="openNote(note)"
            class="flex items-center h-8 text-sm pl-8 pr-3">
            <span class="ml-2 leading-none">
              {{ new Date(note.created).toLocaleString() }}
            </span>
          </a>
        </div>
      </div>
    </div>
    <div class="flex flex-col flex-grow" v-if="Object.keys(activeNote).length">
      <!-- main content - editor -->
      <div class="flex flex-col flex-grow overflow-auto">
        <editor-content :editor="editor" />
      </div>
      <div class="h-16 p-2 bg-gray-100 border-t border-gray-300 text-right">
        <button class="save-note" @click="saveNote()">
          Save Note
        </button>
      </div>
    </div>
    <div class="flex flex-col flex-grow" v-else>
      <!-- main content - notes list -->
      <div class="flex flex-col flex-grow overflow-auto">
        <div v-for="note in notes" :key="note.created">
          <div class="flex px-4 pt-3 pb-4">
            <div class="prose my-2 mx-auto">
              <div>
                <span class="ml-1 text-xs text-gray-500">Created on {{ new Date(note.created).toLocaleString() }}</span>
              </div>
              <div v-html="note.content"></div>
            </div>
          </div>
          <hr class="w-full">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    EditorContent,
    Sidebar,
  },
  data() {
    return {
      editor: null,
    }
  },
  mounted() {
    this.editor = new Editor({
      content: '',
      extensions: [
        StarterKit
      ],
      editorProps: {
        attributes: {
          class: "prose my-6 mx-auto focus:outline-none bg-gray-200 rounded p-2"
        }
      }
    });

    window.addEventListener('offline', e => {
      this.isOffline = true;
    });

    window.addEventListener('online', e => {
      this.isOffline = false;

      this.syncUserData();
    });
  },
  beforeUnmount() {
    this.editor.destroy();
  },
  methods: {
    syncUserData(){
      if (this.isOffline) {
        return;
      }
    }
  }
}
</script>

<style lang="postcss">
button.save-note {
  @apply bg-none border border-gray-900 rounded py-1 px-4 mr-4 mt-3 hover:bg-gray-900 hover:text-white;
}

button.add-note {
  @apply flex items-center justify-center h-6 w-6 ml-1 rounded hover:bg-gray-300;
}
</style>
