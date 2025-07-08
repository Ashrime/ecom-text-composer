
import React, { useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Link, Upload, Type, Palette, Highlighter, Undo, Redo } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setFontFamily } from '../store/editorSlice';
import ImportModal from './ImportModal';
import LinkDialog from './LinkDialog';

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onImageUpload?: (file: File) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onCommand }) => {
  const dispatch = useAppDispatch();
  const { content, fontFamily } = useAppSelector((state) => state.editor);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');

  const toolbarButtons = [
    { command: 'bold', icon: Bold, label: 'Bold (Ctrl+B)' },
    { command: 'italic', icon: Italic, label: 'Italic (Ctrl+I)' },
    { command: 'underline', icon: Underline, label: 'Underline (Ctrl+U)' },
  ];

  const alignmentButtons = [
    { command: 'justifyLeft', icon: AlignLeft, label: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, label: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, label: 'Align Right' },
    { command: 'justifyFull', icon: AlignJustify, label: 'Justify' },
  ];

  const handleHeading = (level: string) => {
    // First, remove any existing formatting
    document.execCommand('formatBlock', false, 'div');
    
    // Then apply the new heading
    if (level !== '') {
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

  const handleTextColor = (color: string) => {
    setTextColor(color);
    onCommand('foreColor', color);
  };

  const handleBackgroundColor = (color: string) => {
    setHighlightColor(color);
    onCommand('hiliteColor', color);
  };

  const handleFontFamily = (font: string) => {
    dispatch(setFontFamily(font));
    onCommand('fontName', font);
  };

  const handleBulletList = (type: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Clear any existing list formatting first
    onCommand('insertUnorderedList');
    onCommand('insertOrderedList');
    
    // Apply bullet list
    onCommand('insertUnorderedList');
    
    // Apply custom styling based on type
    setTimeout(() => {
      const lists = document.querySelectorAll('ul');
      const range = selection.getRangeAt(0);
      
      lists.forEach(ul => {
        if (ul.contains(range.commonAncestorContainer) || range.commonAncestorContainer.contains(ul)) {
          switch (type) {
            case 'disc':
              ul.style.listStyleType = 'disc';
              break;
            case 'circle':
              ul.style.listStyleType = 'circle';
              break;
            case 'square':
              ul.style.listStyleType = 'square';
              break;
            case 'arrow':
              ul.style.listStyleType = 'none';
              ul.querySelectorAll('li').forEach(li => {
                li.style.position = 'relative';
                li.style.paddingLeft = '20px';
                li.setAttribute('data-bullet', '→');
              });
              break;
            case 'check':
              ul.style.listStyleType = 'none';
              ul.querySelectorAll('li').forEach(li => {
                li.style.position = 'relative';
                li.style.paddingLeft = '20px';
                li.setAttribute('data-bullet', '✓');
              });
              break;
          }
        }
      });
    }, 10);
  };

  const handleNumberedList = (type: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Clear any existing list formatting first
    onCommand('insertUnorderedList');
    onCommand('insertOrderedList');
    
    // Apply numbered list
    onCommand('insertOrderedList');
    
    // Apply custom styling based on type
    setTimeout(() => {
      const lists = document.querySelectorAll('ol');
      const range = selection.getRangeAt(0);
      
      lists.forEach(ol => {
        if (ol.contains(range.commonAncestorContainer) || range.commonAncestorContainer.contains(ol)) {
          switch (type) {
            case 'decimal':
              ol.style.listStyleType = 'decimal';
              break;
            case 'lower-alpha':
              ol.style.listStyleType = 'lower-alpha';
              break;
            case 'upper-alpha':
              ol.style.listStyleType = 'upper-alpha';
              break;
            case 'lower-roman':
              ol.style.listStyleType = 'lower-roman';
              break;
            case 'upper-roman':
              ol.style.listStyleType = 'upper-roman';
              break;
          }
        }
      });
    }, 10);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-300 px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between w-full gap-2">
          {/* Left Section - Headings and Font */}
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => handleHeading(e.target.value)}
              className="h-8 px-2 text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[90px]"
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
              className="h-8 px-2 text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[110px]"
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
              className="h-8 px-2 text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[60px]"
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

          {/* Center Section - Formatting Tools */}
          <div className="flex items-center gap-1">
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

            <div className="h-5 w-px bg-gray-300 mx-1" />

            {toolbarButtons.map(({ command, icon: Icon, label }) => (
              <button
                key={command}
                onClick={() => onCommand(command)}
                className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                title={label}
                type="button"
              >
                <Icon size={14} className="text-gray-700" />
              </button>
            ))}

            <div className="h-5 w-px bg-gray-300 mx-1" />

            {/* Color Tools */}
            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                  title="Text Color"
                >
                  <Type size={14} className="text-gray-700" />
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleTextColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </button>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-0.5 rounded" style={{ backgroundColor: textColor }}></div>
              </div>

              <div className="relative">
                <button
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                  title="Highlight Color"
                >
                  <Highlighter size={14} className="text-gray-700" />
                  <input
                    type="color"
                    value={highlightColor}
                    onChange={(e) => handleBackgroundColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </button>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-0.5 rounded" style={{ backgroundColor: highlightColor }}></div>
              </div>
            </div>

            <div className="h-5 w-px bg-gray-300 mx-1" />

            {/* Alignment Tools */}
            {alignmentButtons.map(({ command, icon: Icon, label }) => (
              <button
                key={command}
                onClick={() => onCommand(command)}
                className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                title={label}
                type="button"
              >
                <Icon size={14} className="text-gray-700" />
              </button>
            ))}

            <div className="h-5 w-px bg-gray-300 mx-1" />

            {/* List Options */}
            <div className="flex items-center gap-1">
              <div className="relative group">
                <button
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                  title="Bullet List Options"
                >
                  <List size={14} className="text-gray-700" />
                </button>
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[140px]">
                  <button
                    onClick={() => handleBulletList('disc')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>•</span> Disc
                  </button>
                  <button
                    onClick={() => handleBulletList('circle')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>◦</span> Circle
                  </button>
                  <button
                    onClick={() => handleBulletList('square')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>▪</span> Square
                  </button>
                  <button
                    onClick={() => handleBulletList('arrow')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>→</span> Arrow
                  </button>
                  <button
                    onClick={() => handleBulletList('check')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>✓</span> Check
                  </button>
                </div>
              </div>

              <div className="relative group">
                <button
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                  title="Numbered List Options"
                >
                  <ListOrdered size={14} className="text-gray-700" />
                </button>
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[140px]">
                  <button
                    onClick={() => handleNumberedList('decimal')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>1.</span> Numbers
                  </button>
                  <button
                    onClick={() => handleNumberedList('lower-alpha')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>a.</span> Lowercase
                  </button>
                  <button
                    onClick={() => handleNumberedList('upper-alpha')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>A.</span> Uppercase
                  </button>
                  <button
                    onClick={() => handleNumberedList('lower-roman')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>i.</span> Roman Lower
                  </button>
                  <button
                    onClick={() => handleNumberedList('upper-roman')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>I.</span> Roman Upper
                  </button>
                </div>
              </div>
            </div>

            <div className="h-5 w-px bg-gray-300 mx-1" />

            {/* Link and Import */}
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
    </>
  );
};

export default EditorToolbar;
