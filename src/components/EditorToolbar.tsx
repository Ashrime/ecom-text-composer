
import React, { useState } from 'react';
import { Undo, Redo, Link, Upload, Eye } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setFontFamily } from '../store/editorSlice';
import FormatButtons from './toolbar/FormatButtons';
import AlignmentButtons from './toolbar/AlignmentButtons';
import ListButtons from './toolbar/ListButtons';
import ColorTools from './toolbar/ColorTools';
import ImportModal from './ImportModal';
import LinkDialog from './LinkDialog';
import HTMLPreviewDialog from './toolbar/HTMLPreviewDialog';

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onCommand }) => {
  const dispatch = useAppDispatch();
  const { content, fontFamily } = useAppSelector((state) => state.editor);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showHTMLPreview, setShowHTMLPreview] = useState(false);

  const handleHeading = (level: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (level === '') {
      document.execCommand('formatBlock', false, 'div');
    } else {
      document.execCommand('formatBlock', false, `h${level}`);
    }
    
    // Update content in store
    const editorElement = document.querySelector('.rich-text-editor');
    if (editorElement) {
      dispatch({ type: 'editor/setContent', payload: editorElement.innerHTML });
    }
  };

  const handleFontSize = (size: string) => {
    onCommand('fontSize', size);
  };

  const handleFontFamily = (font: string) => {
    dispatch(setFontFamily(font));
    onCommand('fontName', font);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-300 px-4 py-3 shadow-sm">
        {/* First Row - Main formatting tools */}
        <div className="flex items-center justify-between w-full gap-3 mb-3">
          {/* Left Section - Headings and Font */}
          <div className="flex items-center gap-3">
            <select
              onChange={(e) => handleHeading(e.target.value)}
              className="h-8 px-3 text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[100px]"
              defaultValue=""
            >
              <option value="">Normal</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
            </select>

            <select
              value={fontFamily}
              onChange={(e) => handleFontFamily(e.target.value)}
              className="h-8 px-3 text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
            </select>

            <select
              onChange={(e) => handleFontSize(e.target.value)}
              className="h-8 px-3 text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[70px]"
              defaultValue="3"
            >
              <option value="1">8pt</option>
              <option value="2">10pt</option>
              <option value="3">12pt</option>
              <option value="4">14pt</option>
              <option value="5">18pt</option>
              <option value="6">24pt</option>
              <option value="7">36pt</option>
            </select>
          </div>

          {/* Center Section - Format Tools */}
          <div className="flex items-center gap-3">
            <FormatButtons onCommand={onCommand} />
            
            <div className="h-5 w-px bg-gray-300" />
            
            <ColorTools onCommand={onCommand} />
            
            <div className="h-5 w-px bg-gray-300" />
            
            <ListButtons onCommand={onCommand} />
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLinkDialog(true)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Insert Link"
              type="button"
            >
              <Link size={14} className="text-gray-700" />
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Import Document"
              type="button"
            >
              <Upload size={14} className="text-gray-700" />
            </button>

            <button
              onClick={() => setShowHTMLPreview(true)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="HTML Preview"
              type="button"
            >
              <Eye size={14} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Second Row - Alignment and Undo/Redo */}
        <div className="flex items-center justify-between w-full gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onCommand('undo')}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Undo (Ctrl+Z)"
              type="button"
            >
              <Undo size={14} className="text-gray-700" />
            </button>

            <button
              onClick={() => onCommand('redo')}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Redo (Ctrl+Y)"
              type="button"
            >
              <Redo size={14} className="text-gray-700" />
            </button>

            <div className="h-5 w-px bg-gray-300" />

            <AlignmentButtons onCommand={onCommand} />
          </div>
        </div>
      </div>

      <LinkDialog
        isOpen={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        onInsert={(linkData) => {
          const selection = window.getSelection();
          if (selection && selection.toString()) {
            onCommand('createLink', linkData.url);
            if (linkData.title || linkData.openInNewTab) {
              setTimeout(() => {
                const links = document.querySelectorAll('a[href="' + linkData.url + '"]');
                links.forEach(link => {
                  if (linkData.title) link.setAttribute('title', linkData.title);
                  if (linkData.openInNewTab) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                  }
                });
              }, 10);
            }
          } else {
            const linkHtml = `<a href="${linkData.url}"${linkData.title ? ` title="${linkData.title}"` : ''}${linkData.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${linkData.displayText || linkData.url}</a>`;
            onCommand('insertHTML', linkHtml);
          }
        }}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(content) => {
          onCommand('insertHTML', content);
        }}
      />

      <HTMLPreviewDialog
        isOpen={showHTMLPreview}
        onClose={() => setShowHTMLPreview(false)}
        htmlContent={content}
      />
    </>
  );
};

export default EditorToolbar;
