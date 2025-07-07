
import React, { useRef, useCallback, useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setContent } from '../store/editorSlice';
import EditorToolbar from './EditorToolbar';

const RichTextEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { content } = useAppSelector((state) => state.editor);
  const editorRef = useRef<HTMLDivElement>(null);

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      dispatch(setContent(editorRef.current.innerHTML));
    }
  }, [dispatch]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      dispatch(setContent(editorRef.current.innerHTML));
    }
  }, [dispatch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
      }
    }
  }, [executeCommand]);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = `<img src="${e.target?.result}" style="max-width: 100%; height: auto;" />`;
      executeCommand('insertHTML', img);
    };
    reader.readAsDataURL(file);
  }, [executeCommand]);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML.trim() === '') {
      editor.innerHTML = '<p>Start typing...</p>';
    }
  }, []);

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden bg-white max-w-4xl mx-auto">
      <EditorToolbar onCommand={executeCommand} onImageUpload={handleImageUpload} />
      <div
        ref={editorRef}
        contentEditable
        className="editor-content p-4 outline-none min-h-96 text-gray-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default RichTextEditor;
