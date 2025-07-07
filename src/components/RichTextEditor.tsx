
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
    // For list commands, check if we have selected text
    if (command === 'insertOrderedList' || command === 'insertUnorderedList') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          // We have selected text, apply list to it
          document.execCommand(command, false, value);
        } else {
          // No selection, create a new list item
          document.execCommand(command, false, value);
        }
      } else {
        document.execCommand(command, false, value);
      }
    } else {
      document.execCommand(command, false, value);
    }
    
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
      const img = `<img src="${e.target?.result}" style="max-width: 300px; cursor: move; resize: both; overflow: auto;" draggable="true" class="resizable-image" alt="Uploaded image" />`;
      executeCommand('insertHTML', img);
    };
    reader.readAsDataURL(file);
  }, [executeCommand]);

  // Handle image drag and drop within editor
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // This will be handled by the browser's default drag behavior for images
  }, []);

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

    // Add CSS for resizable images
    const style = document.createElement('style');
    style.textContent = `
      .resizable-image {
        resize: both;
        overflow: auto;
        border: 2px dashed transparent;
        transition: border-color 0.2s;
      }
      .resizable-image:hover {
        border-color: #3b82f6;
      }
      .resizable-image:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full border border-gray-300 rounded-lg bg-white shadow-sm">
      <EditorToolbar onCommand={executeCommand} onImageUpload={handleImageUpload} />
      <div
        ref={editorRef}
        contentEditable
        className="p-6 min-h-96 outline-none text-gray-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        style={{ fontFamily }}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default RichTextEditor;
