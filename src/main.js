import { createApp } from 'vue'
import App from './App.vue'
import './app.css'
import './registerServiceWorker'

import { createStore } from 'vuex'

const store = createStore({
        state() {
                return {
                        database: null,
                        notes: [],
                        activeNote: {},
                        isOffline: !navigator.onLine
                }
        },
        mutations: {
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
                }
        }
})

const app = createApp(App);

app.use(store);

app.mount('#app')
