
import React, { useRef, useCallback, useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setContent } from '../store/editorSlice';
import EditorToolbar from './EditorToolbar';

const RichTextEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { content, fontFamily } = useAppSelector((state) => state.editor);
  const editorRef = useRef<HTMLDivElement>(null);

  const executeCommand = useCallback((command: string, value?: string) => {
    // Focus the editor first
    if (editorRef.current) {
      editorRef.current.focus();
    }

    // Execute the command
    document.execCommand(command, false, value);
    
    // Update content in store
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

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML.trim() === '') {
      editor.innerHTML = '<p>Start typing your content here...</p>';
    }

    // Add CSS for better list styling
    const style = document.createElement('style');
    style.textContent = `
      .rich-text-editor ul {
        list-style-type: disc;
        padding-left: 40px;
        margin: 10px 0;
      }
      .rich-text-editor ol {
        list-style-type: decimal;
        padding-left: 40px;
        margin: 10px 0;
      }
      .rich-text-editor ul li {
        margin: 5px 0;
        list-style-type: disc;
      }
      .rich-text-editor ol li {
        margin: 5px 0;
        list-style-type: inherit;
      }
      .rich-text-editor ul ul {
        list-style-type: circle;
        margin: 5px 0;
      }
      .rich-text-editor ol ol {
        list-style-type: lower-alpha;
        margin: 5px 0;
      }
      .rich-text-editor h1 {
        font-size: 2em;
        font-weight: bold;
        margin: 16px 0;
      }
      .rich-text-editor h2 {
        font-size: 1.5em;
        font-weight: bold;
        margin: 14px 0;
      }
      .rich-text-editor h3 {
        font-size: 1.17em;
        font-weight: bold;
        margin: 12px 0;
      }
      .rich-text-editor h4 {
        font-size: 1em;
        font-weight: bold;
        margin: 10px 0;
      }
      .rich-text-editor p {
        margin: 8px 0;
      }
      .rich-text-editor a {
        color: #2563eb;
        text-decoration: underline;
      }
      .rich-text-editor a:hover {
        color: #1d4ed8;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Dummy handler for image upload (not used anymore)
  const handleImageUpload = useCallback((file: File) => {
    // This is now a dummy function since we removed image upload
    console.log('Image upload not supported');
  }, []);

  return (
    <div className="w-full border border-gray-300 rounded-lg bg-white shadow-sm">
      <EditorToolbar onCommand={executeCommand} onImageUpload={handleImageUpload} />
      <div
        ref={editorRef}
        contentEditable
        className="rich-text-editor p-6 min-h-96 outline-none text-gray-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        style={{ fontFamily }}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default RichTextEditor;
