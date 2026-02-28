import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { Editor } from '@tiptap/react'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
    
  })

  if (!editor) return null

  return (
    <>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
}

export default Tiptap

const ToolBar = ({ editor }: { editor: Editor }) => {
  if (!editor) return <div>Loading Editor......</div> 

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive('bold') ?? false,
    }),
  })

  return (
    <button
      onClick={() => editor.chain().focus().toggleBold().run()}
      className={editorState.isBold ? 'is-active' : ''}
    >
      Bold
    </button>
  )
}