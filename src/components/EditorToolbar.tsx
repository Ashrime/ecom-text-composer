
import React, { useState } from 'react';
import { Undo, Redo, Link, Upload, Code, Table, FileText } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setFontFamily } from '../store/editorSlice';
import FormatButtons from './toolbar/FormatButtons';
import AlignmentButtons from './toolbar/AlignmentButtons';
import ListButtons from './toolbar/ListButtons';
import ColorTools from './toolbar/ColorTools';
import ImportModal from './ImportModal';
import LinkDialog from './LinkDialog';
import TableDialog from './TableDialog';
import TemplateDialog from './TemplateDialog';

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onCommand }) => {
  const dispatch = useAppDispatch();
  const { fontFamily } = useAppSelector((state) => state.editor);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleHeading = (level: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (level === '') {
      document.execCommand('formatBlock', false, 'div');
    } else {
      document.execCommand('formatBlock', false, `h${level}`);
    }
    
    // Trigger content update
    setTimeout(() => {
      const editorElement = document.querySelector('.rich-text-editor');
      if (editorElement) {
        const event = new Event('input', { bubbles: true });
        editorElement.dispatchEvent(event);
      }
    }, 10);
  };

  const handleFontSize = (size: string) => {
    onCommand('fontSize', size);
  };

  const handleFontFamily = (font: string) => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      // Apply font to selected text only
      onCommand('fontName', font);
    } else {
      // Update global font family for new text
      dispatch(setFontFamily(font));
      onCommand('fontName', font);
    }
  };

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
    const editorElement = document.querySelector('.rich-text-editor') as HTMLElement;
    if (editorElement) {
      if (!showPreview) {
        // Show HTML
        const htmlContent = editorElement.innerHTML;
        editorElement.style.whiteSpace = 'pre-wrap';
        editorElement.style.fontFamily = 'monospace';
        editorElement.textContent = htmlContent;
      } else {
        // Show rendered content
        const htmlContent = editorElement.textContent || '';
        editorElement.style.whiteSpace = '';
        editorElement.style.fontFamily = fontFamily;
        editorElement.innerHTML = htmlContent;
      }
    }
  };

  const insertTableAtCursor = (tableHtml: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const tableContainer = document.createElement('div');
      tableContainer.innerHTML = tableHtml;
      const tableElement = tableContainer.firstChild as HTMLElement;
      
      range.insertNode(tableElement);
      
      // Move cursor after the table
      range.setStartAfter(tableElement);
      range.setEndAfter(tableElement);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Trigger content update
      const editorElement = document.querySelector('.rich-text-editor');
      if (editorElement) {
        const event = new Event('input', { bubbles: true });
        editorElement.dispatchEvent(event);
      }
    }
  };

  return (
    <>
      <div className="bg-white border-b border-gray-300 px-2 sm:px-4 py-3 shadow-sm">
        {/* First Row - Main formatting tools */}
        <div className="flex flex-wrap items-center justify-between w-full gap-2 sm:gap-4 mb-3">
          {/* Left Section - Headings and Font */}
          <div className="flex items-center gap-1 sm:gap-3 flex-wrap">
            <select
              onChange={(e) => handleHeading(e.target.value)}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[90px] sm:min-w-[110px]"
              defaultValue=""
            >
              <option value="">Normal</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
            </select>

            <select
              value={fontFamily}
              onChange={(e) => handleFontFamily(e.target.value)}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[100px] sm:min-w-[130px]"
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
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[60px] sm:min-w-[70px]"
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
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <FormatButtons onCommand={onCommand} />
            
            <div className="h-5 w-px bg-gray-300 hidden sm:block" />
            
            <ColorTools onCommand={onCommand} />
            
            <div className="h-5 w-px bg-gray-300 hidden sm:block" />
            
            <ListButtons onCommand={onCommand} />
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 sm:gap-3 flex-wrap">
            <button
              onClick={() => setShowLinkDialog(true)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Insert Link"
              type="button"
            >
              <Link size={14} className="text-gray-700" />
            </button>

            <button
              onClick={() => setShowTableDialog(true)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Insert Table"
              type="button"
            >
              <Table size={14} className="text-gray-700" />
            </button>

            <button
              onClick={() => setShowTemplateDialog(true)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Insert Template"
              type="button"
            >
              <FileText size={14} className="text-gray-700" />
            </button>

            <button
              onClick={handlePreviewToggle}
              className={`h-8 w-8 flex items-center justify-center rounded transition-colors border border-transparent hover:border-gray-300 ${
                showPreview ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Toggle HTML Preview"
              type="button"
            >
              <Code size={14} />
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Import Document"
              type="button"
            >
              <Upload size={14} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Second Row - Alignment and Undo/Redo */}
        <div className="flex items-center justify-between w-full gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-3">
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

            <div className="h-5 w-px bg-gray-300 hidden sm:block" />

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
            // Replace selected text with link
            const selectedText = selection.toString();
            const displayText = linkData.title || selectedText;
            const linkHtml = `<a href="${linkData.url}"${linkData.title ? ` title="${linkData.title}"` : ''}${linkData.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${displayText}</a>`;
            onCommand('insertHTML', linkHtml);
          } else {
            // Insert new link at cursor
            const linkHtml = `<a href="${linkData.url}"${linkData.title ? ` title="${linkData.title}"` : ''}${linkData.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${linkData.displayText || linkData.url}</a>`;
            onCommand('insertHTML', linkHtml);
          }
        }}
      />

      <TableDialog
        isOpen={showTableDialog}
        onClose={() => setShowTableDialog(false)}
        onInsert={(tableData) => {
          let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
          
          // Create header if requested
          if (tableData.hasHeader) {
            tableHtml += '<thead><tr>';
            for (let i = 0; i < tableData.cols; i++) {
              tableHtml += '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold;">Header ' + (i + 1) + '</th>';
            }
            tableHtml += '</tr></thead>';
          }
          
          // Create body rows
          tableHtml += '<tbody>';
          const startRow = tableData.hasHeader ? 1 : 0;
          for (let i = startRow; i < tableData.rows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < tableData.cols; j++) {
              tableHtml += '<td style="border: 1px solid #ddd; padding: 8px;">Cell ' + (i + 1) + '-' + (j + 1) + '</td>';
            }
            tableHtml += '</tr>';
          }
          tableHtml += '</tbody></table>';
          
          insertTableAtCursor(tableHtml);
        }}
      />

      <TemplateDialog
        isOpen={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onInsert={(templateContent) => {
          onCommand('insertHTML', templateContent);
        }}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(content) => {
          onCommand('insertHTML', content);
        }}
      />
    </>
  );
};

export default EditorToolbar;
