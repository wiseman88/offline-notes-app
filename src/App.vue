<template>
  <div class="flex w-screen h-screen text-gray-700">
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
    <div class="flex flex-col flex-grow">
      <!-- main content -->
      <div class="flex flex-col flex-grow overflow-auto">
        <editor-content :editor="editor" />
      </div>
      <div class="h-16 p-2 bg-gray-100 border-t border-gray-300 text-right">
        <button class="save-note" @click="saveNote()">
          Save Note
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

export default {
  name: 'App',
  components: {
    EditorContent
  },
  data() {
    return {
      editor: null,
      database: null,
      notes: [],
      activeNote: {}
    }
  },
  async created() {
    this.database = await this.getDatabase();
    let notes = await this.getNotes();
    this.notes = notes.reverse();
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
  },
  beforeUnmount() {
    this.editor.destroy();
  },
  methods: {
    async getDatabase() {
      return new Promise((resolve, reject) => {
        let db = window.indexedDB.open("notes", 2);

        db.onerror = e => {
          reject("Error opening the database.");
        };

        db.onsuccess = e => {
          console.log('db.onsuccess', e);
          resolve(e.target.result);
        };

        db.onupgradeneeded = e => {
          console.log('db.onupgradeneeded', e);

          if (e.oldVersion === 1) {
            e.target.result.deleteObjectStore("notes");
          }
          e.target.result.createObjectStore("notes", { keyPath: "created" });
        };
      });
    },
    async saveNote() {
      return new Promise((resolve, reject) => {
        let noteStore = this.database.transaction('notes', 'readwrite')
            .objectStore('notes');

        let noteRequest = noteStore.get(this.activeNote.created);

        noteRequest.onerror = e => {
          reject('Error saving the note in the database');
        }

        noteRequest.onsuccess = e => {
          let note = e.target.result;
          note.content = this.editor.getHTML();

          let updateRequest = noteStore.put(note);

          updateRequest.onerror = e => {
            reject('Error stroing the update in the database.');
          }

          updateRequest.onsuccess = e => {
            let noteIndex = this.notes.findIndex(n => n.created === note.created);
            this.notes[noteIndex] = note;
            resolve();
          }
        }
      });
    },
    async getNotes() {
      return new Promise((resolve, reject) => {
        this.database.transaction('notes')
          .objectStore('notes')
          .getAll()
          .onsuccess = e => {
            console.log('getNotes()', e.target.result);
            resolve(e.target.result);
          }
      });
    },
    openNote(note) {
      this.editor.commands.setContent(note.content);
      this.activeNote = note;
    },
    showAllNotes() {
      this.editor.commands.clearContent();
      this.activeNote = {};
    },
    addNewNote() {
      return new Promise((resolve, reject) => {
        let transaction = this.database.transaction('notes', 'readwrite');
        transaction.oncomplete = e => {
          resolve();
        }

        let now = new Date();
        let note = {
          content: '',
          created: now.getTime()
        }

        // add same note to the sidebar
        this.notes.unshift(note);

        // set activeNote as the new note
        this.activeNote = note;
        transaction.objectStore('notes').add(note);
      });
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
