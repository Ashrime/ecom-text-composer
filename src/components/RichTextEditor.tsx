
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
    if (editorRef.current) {
      editorRef.current.focus();
    }

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
        case 'z':
          if (!e.shiftKey) {
            e.preventDefault();
            executeCommand('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          executeCommand('redo');
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

    // Enhanced CSS for better styling including tables
    const style = document.createElement('style');
    style.textContent = `
      .rich-text-editor ul {
        list-style-position: outside;
        padding-left: 30px;
        margin: 10px 0;
      }
      .rich-text-editor ol {
        list-style-position: outside;
        padding-left: 30px;
        margin: 10px 0;
      }
      .rich-text-editor li {
        margin: 5px 0;
        line-height: 1.5;
      }
      .rich-text-editor ul ul {
        list-style-type: circle;
        margin: 5px 0;
        padding-left: 25px;
      }
      .rich-text-editor ol ol {
        list-style-type: lower-alpha;
        margin: 5px 0;
        padding-left: 25px;
      }
      .rich-text-editor h1 {
        font-size: 2.25em;
        font-weight: bold;
        margin: 20px 0 16px 0;
        line-height: 1.2;
        color: #1F2937;
      }
      .rich-text-editor h2 {
        font-size: 1.875em;
        font-weight: bold;
        margin: 18px 0 14px 0;
        line-height: 1.3;
        color: #1F2937;
      }
      .rich-text-editor h3 {
        font-size: 1.5em;
        font-weight: bold;
        margin: 16px 0 12px 0;
        line-height: 1.4;
        color: #1F2937;
      }
      .rich-text-editor h4 {
        font-size: 1.25em;
        font-weight: bold;
        margin: 14px 0 10px 0;
        line-height: 1.4;
        color: #1F2937;
      }
      .rich-text-editor h5 {
        font-size: 1.125em;
        font-weight: bold;
        margin: 12px 0 8px 0;
        line-height: 1.4;
        color: #1F2937;
      }
      .rich-text-editor h6 {
        font-size: 1em;
        font-weight: bold;
        margin: 10px 0 6px 0;
        line-height: 1.4;
        color: #1F2937;
      }
      .rich-text-editor p {
        margin: 10px 0;
        line-height: 1.6;
      }
      .rich-text-editor a {
        color: #2563eb;
        text-decoration: underline;
        transition: color 0.2s;
      }
      .rich-text-editor a:hover {
        color: #1d4ed8;
      }
      .rich-text-editor table {
        border-collapse: collapse;
        width: 100%;
        margin: 15px 0;
        font-size: 14px;
      }
      .rich-text-editor th,
      .rich-text-editor td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .rich-text-editor th {
        background-color: #f5f5f5;
        font-weight: bold;
      }
      .rich-text-editor tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      .rich-text-editor tr:hover {
        background-color: #f5f5f5;
      }
      .rich-text-editor blockquote {
        border-left: 4px solid #E5E7EB;
        margin: 16px 0;
        padding-left: 16px;
        font-style: italic;
        color: #6B7280;
      }
      .rich-text-editor code {
        background-color: #F3F4F6;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
      }
      .rich-text-editor pre {
        background-color: #F3F4F6;
        padding: 12px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 12px 0;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full border border-gray-300 rounded-lg bg-white shadow-sm">
      <EditorToolbar onCommand={executeCommand} />
      <div
        ref={editorRef}
        contentEditable
        className="rich-text-editor p-4 sm:p-6 min-h-96 outline-none text-gray-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        style={{ fontFamily }}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default RichTextEditor;
