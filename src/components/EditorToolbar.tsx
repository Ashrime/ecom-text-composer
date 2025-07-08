
import React, { useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Link, Download, Type, Palette, Highlighter } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setFontFamily } from '../store/editorSlice';
import ExportModal from './ExportModal';
import LinkDialog from './LinkDialog';

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onImageUpload: (file: File) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onCommand, onImageUpload }) => {
  const dispatch = useAppDispatch();
  const { content, fontFamily } = useAppSelector((state) => state.editor);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');

  const toolbarButtons = [
    { command: 'bold', icon: Bold, label: 'Bold' },
    { command: 'italic', icon: Italic, label: 'Italic' },
    { command: 'underline', icon: Underline, label: 'Underline' },
  ];

  const alignmentButtons = [
    { command: 'justifyLeft', icon: AlignLeft, label: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, label: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, label: 'Align Right' },
    { command: 'justifyFull', icon: AlignJustify, label: 'Justify' },
  ];

  const handleHeading = (level: string) => {
    if (level === '') {
      onCommand('formatBlock', 'div');
    } else {
      onCommand('formatBlock', `h${level}`);
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

  const handleListType = (type: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // First remove any existing list formatting
      onCommand('insertUnorderedList');
      onCommand('insertOrderedList');
      
      // Apply the new list type
      if (type === 'bullet') {
        onCommand('insertUnorderedList');
      } else if (type === 'number') {
        onCommand('insertOrderedList');
      } else if (type === 'roman') {
        onCommand('insertOrderedList');
        // Apply Roman numeral styling
        setTimeout(() => {
          const listElements = document.querySelectorAll('ol');
          listElements.forEach(ol => {
            if (ol.contains(range.commonAncestorContainer)) {
              ol.style.listStyleType = 'upper-roman';
            }
          });
        }, 10);
      } else if (type === 'alpha') {
        onCommand('insertOrderedList');
        // Apply alphabetical styling
        setTimeout(() => {
          const listElements = document.querySelectorAll('ol');
          listElements.forEach(ol => {
            if (ol.contains(range.commonAncestorContainer)) {
              ol.style.listStyleType = 'upper-alpha';
            }
          });
        }, 10);
      }
    }
  };

  return (
    <>
      <div className="bg-white border-b border-gray-300 px-4 py-3 shadow-sm">
        {/* Main Toolbar Row */}
        <div className="flex items-center justify-between w-full gap-2">
          {/* Left Section - Headings and Font */}
          <div className="flex items-center gap-3">
            <select
              onChange={(e) => handleHeading(e.target.value)}
              className="h-9 px-3 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[100px]"
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
              className="h-9 px-3 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
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
              className="h-9 px-3 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[70px]"
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
            {toolbarButtons.map(({ command, icon: Icon, label }) => (
              <button
                key={command}
                onClick={() => onCommand(command)}
                className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                title={label}
                type="button"
              >
                <Icon size={16} className="text-gray-700" />
              </button>
            ))}

            <div className="h-6 w-px bg-gray-300 mx-1" />

            {/* Color Tools */}
            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                  title="Text Color"
                >
                  <Type size={16} className="text-gray-700" />
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleTextColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </button>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 rounded" style={{ backgroundColor: textColor }}></div>
              </div>

              <div className="relative">
                <button
                  className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                  title="Highlight Color"
                >
                  <Highlighter size={16} className="text-gray-700" />
                  <input
                    type="color"
                    value={highlightColor}
                    onChange={(e) => handleBackgroundColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </button>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 rounded" style={{ backgroundColor: highlightColor }}></div>
              </div>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1" />

            {/* Alignment Tools */}
            {alignmentButtons.map(({ command, icon: Icon, label }) => (
              <button
                key={command}
                onClick={() => onCommand(command)}
                className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                title={label}
                type="button"
              >
                <Icon size={16} className="text-gray-700" />
              </button>
            ))}
          </div>

          {/* Right Section - Lists and Actions */}
          <div className="flex items-center gap-1">
            {/* List Options */}
            <div className="flex items-center gap-1">
              <div className="relative group">
                <button
                  className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                  title="Bullet List Options"
                >
                  <List size={16} className="text-gray-700" />
                </button>
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[150px]">
                  <button
                    onClick={() => handleListType('bullet')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>•</span> Bullet List
                  </button>
                </div>
              </div>

              <div className="relative group">
                <button
                  className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                  title="Numbered List Options"
                >
                  <ListOrdered size={16} className="text-gray-700" />
                </button>
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[150px]">
                  <button
                    onClick={() => handleListType('number')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>1.</span> Numbers
                  </button>
                  <button
                    onClick={() => handleListType('roman')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>I.</span> Roman
                  </button>
                  <button
                    onClick={() => handleListType('alpha')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>A.</span> Letters
                  </button>
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1" />

            {/* Link and Export */}
            <button
              onClick={() => setShowLinkDialog(true)}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Insert Link"
              type="button"
            >
              <Link size={16} className="text-gray-700" />
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Export Document"
              type="button"
            >
              <Download size={16} className="text-gray-700" />
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
            // If text is selected, create link with selected text
            onCommand('createLink', linkData.url);
            if (linkData.title) {
              // Add title attribute to the created link
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
            // If no text selected, insert link with display text
            const linkHtml = `<a href="${linkData.url}"${linkData.title ? ` title="${linkData.title}"` : ''}${linkData.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${linkData.displayText || linkData.url}</a>`;
            onCommand('insertHTML', linkHtml);
          }
        }}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        content={content}
      />
    </>
  );
};

export default EditorToolbar;
