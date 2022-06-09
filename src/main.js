import { createApp } from 'vue'
import App from './App.vue'
import './app.css'
import './registerServiceWorker'

import { createStore } from 'vuex'

const store = createStore({
        state() {
                return {
                        editor: null,
                        database: null,
                        notes: [],
                        activeNote: {},
                        isOffline: !navigator.onLine
                }
        },
        mutations: {
                updateEditor(state, editor){
                        state.editor = editor
                },
                updateDatabase(state, database) {
                        state.database = database
                },
                updateNotes(state, databnotesase) {
                        state.notes = notes
                }
        },
        actions: {
                init({ dispatch }) {
                        await dispatch('initDatabase');
                        dispatch('initNotes');
                },
                initDatabase({ commit }) {

                        let db = window.indexedDB.open("notes", 2);

                        db.onerror = e => {
                                console.log("Error opening the database.");
                        };

                        db.onsuccess = e => {
                                console.log('db.onsuccess', e);
                                commit('updateDatabase', e.target.result);
                        };

                        db.onupgradeneeded = e => {
                                console.log('db.onupgradeneeded', e);

                                if (e.oldVersion === 1) {
                                        e.target.result.deleteObjectStore("notes");
                                }
                                e.target.result.createObjectStore("notes", { keyPath: "created" });
                        };

                        commit('updateDatabase', database);
                },
                initNotes({ commit, state }) {
                        commit('updateNotes', notes);

                        state.database.transaction('notes')
                                .objectStore('notes')
                                .getAll()
                                .onsuccess = e => {
                                        console.log('getNotes()', e.target.result);
                                        commit('updateNotes', e.target.result);
                                }
                },
                saveNote({ commit, state }, note) {
                        let noteStore = state.database.transaction('notes', 'readwrite')
                                .objectStore('notes');

                        let noteRequest = noteStore.get(state.activeNote.created);

                        noteRequest.onerror = e => {
                                console.log('Error saving the note in the database');
                        }

                        noteRequest.onsuccess = e => {
                                let note = e.target.result;
                                note.content = state.editor.getHTML();

                                let updateRequest = noteStore.put(note);

                                updateRequest.onerror = e => {
                                        console.log('Error stroing the update in the database.');
                                }

                                updateRequest.onsuccess = e => {
                                        let notes = state.notes;

                                        let noteIndex = notes.findIndex(n => n.created === note.created);
                                        notes[noteIndex] = note;
                                        
                                        commit('updateNotes', notes);
                                }
                        }
                }
        }
})

const app = createApp(App);

app.use(store);

app.mount('#app')
