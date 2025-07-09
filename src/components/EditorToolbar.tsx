import React, { useState } from 'react';
import { Undo, Redo, Link, Upload, Code, Table, FileText } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setFontFamily, setContent } from '../store/editorSlice';
import FormatButtons from './toolbar/FormatButtons';
import AlignmentButtons from './toolbar/AlignmentButtons';
import ListButtons from './toolbar/ListButtons';
import ColorTools from './toolbar/ColorTools';
import ImportModal from './ImportModal';
import LinkDialog from './LinkDialog';
import TableDialog from './TableDialog';
import TemplateDialog from './TemplateDialog';
import DOMPurify from 'dompurify';

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

  // Store editor history for proper undo/redo
  const [editorHistory, setEditorHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = () => {
    const editorElement = document.querySelector('.rich-text-editor') as HTMLElement;
    if (editorElement) {
      const content = editorElement.innerHTML;
      const newHistory = [...editorHistory.slice(0, historyIndex + 1), content];
      setEditorHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const editorElement = document.querySelector('.rich-text-editor') as HTMLElement;
      if (editorElement && editorHistory[newIndex]) {
        editorElement.innerHTML = editorHistory[newIndex];
        setHistoryIndex(newIndex);
        dispatch(setContent(editorHistory[newIndex]));
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < editorHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const editorElement = document.querySelector('.rich-text-editor') as HTMLElement;
      if (editorElement && editorHistory[newIndex]) {
        editorElement.innerHTML = editorHistory[newIndex];
        setHistoryIndex(newIndex);
        dispatch(setContent(editorHistory[newIndex]));
      }
    }
  };

  const handleHeading = (level: string) => {
    saveToHistory();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (level === '') {
      document.execCommand('formatBlock', false, 'div');
    } else {
      document.execCommand('formatBlock', false, `h${level}`);
    }
    
    setTimeout(() => {
      const editorElement = document.querySelector('.rich-text-editor');
      if (editorElement) {
        const event = new Event('input', { bubbles: true });
        editorElement.dispatchEvent(event);
      }
    }, 10);
  };

  const handleFontSize = (size: string) => {
    saveToHistory();
    onCommand('fontSize', size);
  };

  const handleFontFamily = (font: string) => {
    saveToHistory();
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      onCommand('fontName', font);
    } else {
      dispatch(setFontFamily(font));
    }
  };

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
    const editorElement = document.querySelector('.rich-text-editor') as HTMLElement;
    if (editorElement) {
      if (!showPreview) {
        const htmlContent = editorElement.innerHTML;
        editorElement.style.whiteSpace = 'pre-wrap';
        editorElement.style.fontFamily = 'monospace';
        editorElement.textContent = htmlContent;
      } else {
        const htmlContent = editorElement.textContent || '';
        editorElement.style.whiteSpace = '';
        editorElement.style.fontFamily = fontFamily;
        editorElement.innerHTML = htmlContent;
      }
    }
  };

  const insertAtCursor = (html: string) => {
    saveToHistory();
    console.log('Inserting content at cursor:', html);
    
    const selection = window.getSelection();
    const editorElement = document.querySelector('.rich-text-editor') as HTMLElement;
    
    if (!editorElement) {
      console.error('Editor element not found');
      return;
    }

    const sanitizedHtml = DOMPurify.sanitize(html);
    console.log('Sanitized HTML:', sanitizedHtml);

    editorElement.focus();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitizedHtml;
      
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      
      range.insertNode(fragment);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitizedHtml;
      while (tempDiv.firstChild) {
        editorElement.appendChild(tempDiv.firstChild);
      }
    }
    
    setTimeout(() => {
      const event = new Event('input', { bubbles: true });
      editorElement.dispatchEvent(event);
    }, 10);
  };

  const linkSpecificText = (keyword: string, url: string, openInNewTab: boolean) => {
    const editorElement = document.querySelector('.rich-text-editor') as HTMLElement;
    if (!editorElement) return;

    const content = editorElement.innerHTML;
    
    // Escape keyword for use in RegExp
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create regex to replace only exact matches that aren't already in links
    const regex = new RegExp(`(?<!<[^>]*>)\\b(${escapedKeyword})\\b(?![^<]*</a>)`, 'g');
    
    const target = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const replacedContent = content.replace(regex, `<a href="${url}"${target} style="color: #2563eb; text-decoration: underline;">$1</a>`);
    
    if (replacedContent !== content) {
      editorElement.innerHTML = replacedContent;
      
      // Trigger content change
      setTimeout(() => {
        const event = new Event('input', { bubbles: true });
        editorElement.dispatchEvent(event);
      }, 10);
    }
  };

  const handleLinkInsert = (linkData: any) => {
    console.log('Handle link insert called with:', linkData);
    saveToHistory();
    
    if (linkData.selectedText) {
      linkSpecificText(linkData.selectedText, linkData.url, linkData.openInNewTab);
    }
  };

  const makeTableEditable = (table: HTMLElement) => {
    // Make table cells editable
    const cells = table.querySelectorAll('td, th');
    cells.forEach(cell => {
      cell.setAttribute('contenteditable', 'true');
      cell.style.minWidth = '50px';
      cell.style.minHeight = '20px';
    });

    // Add context menu for table operations
    table.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target.tagName === 'TD' || target.tagName === 'TH') {
        showTableContextMenu(e, target, table);
      }
    });
  };

  const showTableContextMenu = (e: MouseEvent, cell: HTMLElement, table: HTMLElement) => {
    const menu = document.createElement('div');
    menu.className = 'fixed bg-white border border-gray-300 rounded shadow-lg z-50 p-2';
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';

    const addRowButton = document.createElement('button');
    addRowButton.textContent = 'Add Row';
    addRowButton.className = 'block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm';
    addRowButton.onclick = () => addTableRow(table, cell);

    const addColButton = document.createElement('button');
    addColButton.textContent = 'Add Column';
    addColButton.className = 'block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm';
    addColButton.onclick = () => addTableColumn(table, cell);

    const deleteRowButton = document.createElement('button');
    deleteRowButton.textContent = 'Delete Row';
    deleteRowButton.className = 'block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm text-red-600';
    deleteRowButton.onclick = () => deleteTableRow(table, cell);

    const deleteColButton = document.createElement('button');
    deleteColButton.textContent = 'Delete Column';
    deleteColButton.className = 'block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm text-red-600';
    deleteColButton.onclick = () => deleteTableColumn(table, cell);

    menu.appendChild(addRowButton);
    menu.appendChild(addColButton);
    menu.appendChild(deleteRowButton);
    menu.appendChild(deleteColButton);

    document.body.appendChild(menu);

    // Remove menu when clicking elsewhere
    const removeMenu = () => {
      document.body.removeChild(menu);
      document.removeEventListener('click', removeMenu);
    };
    setTimeout(() => document.addEventListener('click', removeMenu), 0);
  };

  const addTableRow = (table: HTMLElement, cell: HTMLElement) => {
    saveToHistory();
    const row = cell.closest('tr');
    if (row) {
      const newRow = row.cloneNode(true) as HTMLElement;
      const cells = newRow.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.textContent = '';
        cell.setAttribute('contenteditable', 'true');
      });
      row.parentNode?.insertBefore(newRow, row.nextSibling);
    }
  };

  const addTableColumn = (table: HTMLElement, cell: HTMLElement) => {
    saveToHistory();
    const cellIndex = Array.from(cell.parentNode!.children).indexOf(cell);
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
      const newCell = document.createElement(row.querySelector('th') ? 'th' : 'td');
      newCell.setAttribute('contenteditable', 'true');
      newCell.style.border = '1px solid #ddd';
      newCell.style.padding = '12px 8px';
      newCell.textContent = '';
      
      const referenceCell = row.children[cellIndex];
      referenceCell.parentNode?.insertBefore(newCell, referenceCell.nextSibling);
    });
  };

  const deleteTableRow = (table: HTMLElement, cell: HTMLElement) => {
    saveToHistory();
    const row = cell.closest('tr');
    if (row && table.querySelectorAll('tr').length > 1) {
      row.remove();
    }
  };

  const deleteTableColumn = (table: HTMLElement, cell: HTMLElement) => {
    saveToHistory();
    const cellIndex = Array.from(cell.parentNode!.children).indexOf(cell);
    const rows = table.querySelectorAll('tr');
    
    if (rows.length > 0 && rows[0].children.length > 1) {
      rows.forEach(row => {
        if (row.children[cellIndex]) {
          row.children[cellIndex].remove();
        }
      });
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
            <FormatButtons onCommand={(cmd, val) => { saveToHistory(); onCommand(cmd, val); }} />
            
            <div className="h-5 w-px bg-gray-300 hidden sm:block" />
            
            <ColorTools onCommand={(cmd, val) => { saveToHistory(); onCommand(cmd, val); }} />
            
            <div className="h-5 w-px bg-gray-300 hidden sm:block" />
            
            <ListButtons onCommand={(cmd, val) => { saveToHistory(); onCommand(cmd, val); }} />
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
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
              type="button"
            >
              <Undo size={14} className="text-gray-700" />
            </button>

            <button
              onClick={handleRedo}
              disabled={historyIndex >= editorHistory.length - 1}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
              type="button"
            >
              <Redo size={14} className="text-gray-700" />
            </button>

            <div className="h-5 w-px bg-gray-300 hidden sm:block" />

            <AlignmentButtons onCommand={(cmd, val) => { saveToHistory(); onCommand(cmd, val); }} />
          </div>
        </div>
      </div>

      <LinkDialog
        isOpen={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        onInsert={handleLinkInsert}
      />

      <TableDialog
        isOpen={showTableDialog}
        onClose={() => setShowTableDialog(false)}
        onInsert={(tableData) => {
          console.log('Table data received:', tableData);
          
          let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 15px 0; font-size: 14px; cursor: pointer;" class="editable-table">';
          
          if (tableData.hasHeader) {
            tableHtml += '<thead><tr>';
            for (let i = 0; i < tableData.cols; i++) {
              tableHtml += `<th contenteditable="true" style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; background-color: #f8f9fa; font-weight: bold; min-width: 50px;">Header ${i + 1}</th>`;
            }
            tableHtml += '</tr></thead>';
          }
          
          tableHtml += '<tbody>';
          const startRow = tableData.hasHeader ? 1 : 0;
          for (let i = startRow; i < tableData.rows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < tableData.cols; j++) {
              tableHtml += `<td contenteditable="true" style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; min-width: 50px;">Cell ${i + 1}-${j + 1}</td>`;
            }
            tableHtml += '</tr>';
          }
          tableHtml += '</tbody></table><p><br></p>';
          
          console.log('Generated table HTML:', tableHtml);
          insertAtCursor(tableHtml);
          
          // Make the table editable after insertion
          setTimeout(() => {
            const tables = document.querySelectorAll('.rich-text-editor .editable-table');
            tables.forEach(table => makeTableEditable(table as HTMLElement));
          }, 100);
        }}
      />

      <TemplateDialog
        isOpen={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onInsert={(templateContent) => {
          console.log('Template content received:', templateContent);
          insertAtCursor(templateContent);
        }}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(content) => {
          const sanitizedContent = DOMPurify.sanitize(content);
          insertAtCursor(sanitizedContent);
        }}
      />
    </>
  );
};

export default EditorToolbar;
