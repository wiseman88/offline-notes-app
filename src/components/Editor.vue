<template>
	<div class="flex flex-col flex-grow">
		<!-- main content - editor -->
		<div class="flex flex-col flex-grow overflow-auto">
			<editor-content :editor="editor" />
		</div>
		<div class="h-16 p-2 bg-gray-100 border-t border-gray-300 text-right">
			<button class="save-note" @click="$store.dispatch('saveNote')">Save Note</button>
		</div>
	</div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
export default {
	components: {
		EditorContent,
	},
	mounted() {
		let editor = new Editor({
			content: "",
			extensions: [StarterKit],
			editorProps: {
				attributes: {
					class: "prose my-6 mx-auto focus:outline-none bg-gray-200 rounded p-2",
				},
			},
		});

                this.$store.commit('updateEditor', editor);
	},
        computed: {
                editor(){
                        return this.$store.state.editor;
                }
        }
};
</script>

<style>
</style>