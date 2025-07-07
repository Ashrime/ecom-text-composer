
import React, { useRef, useCallback, useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setContent, setDimensions } from '../store/editorSlice';
import EditorToolbar from './EditorToolbar';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react';

const RichTextEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { content, width, height } = useAppSelector((state) => state.editor);
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

  const resizeEditor = useCallback((newWidth: number, newHeight: number) => {
    dispatch(setDimensions({ width: newWidth, height: newHeight }));
  }, [dispatch]);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden bg-white">
      <EditorToolbar onCommand={executeCommand} onResize={resizeEditor} />
      <div
        ref={editorRef}
        contentEditable
        className="editor-content p-4 outline-none min-h-96 text-gray-800 leading-relaxed"
        style={{ 
          width: `${width}px`,
          height: `${height}px`,
          resize: 'both',
          overflow: 'auto'
        }}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        placeholder="Start typing..."
      />
    </div>
  );
};

export default RichTextEditor;
