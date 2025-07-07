
import React, { useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ListOrdered, List, Link, Image, Download } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setFontFamily } from '../store/editorSlice';
import ImageModal from './ImageModal';
import ExportModal from './ExportModal';

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onImageUpload: (file: File) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onCommand, onImageUpload }) => {
  const dispatch = useAppDispatch();
  const { content, fontFamily } = useAppSelector((state) => state.editor);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const toolbarButtons = [
    { command: 'bold', icon: Bold, label: 'Bold' },
    { command: 'italic', icon: Italic, label: 'Italic' },
    { command: 'underline', icon: Underline, label: 'Underline' },
  ];

  const alignmentButtons = [
    { command: 'justifyLeft', icon: AlignLeft, label: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, label: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, label: 'Align Right' },
  ];

  const listButtons = [
    { command: 'insertOrderedList', icon: ListOrdered, label: 'Ordered List' },
    { command: 'insertUnorderedList', icon: List, label: 'Unordered List' },
  ];

  const handleHeading = (level: string) => {
    onCommand('formatBlock', `h${level}`);
  };

  const handleFontSize = (size: string) => {
    onCommand('fontSize', size);
  };

  const handleTextColor = (color: string) => {
    onCommand('foreColor', color);
  };

  const handleBackgroundColor = (color: string) => {
    onCommand('hiliteColor', color);
  };

  const handleFontFamily = (font: string) => {
    dispatch(setFontFamily(font));
    onCommand('fontName', font);
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      onCommand('createLink', url);
    }
  };

  const handleImageInsert = (imageData: { src: string; alt: string }) => {
    const img = `<img src="${imageData.src}" alt="${imageData.alt}" style="max-width: 300px; cursor: move; resize: both; overflow: auto;" draggable="true" class="resizable-image" />`;
    onCommand('insertHTML', img);
  };

  return (
    <>
      <div className="bg-white border-b-2 border-gray-200 px-4 py-3 shadow-sm">
        {/* First Row - Headings and Basic Formatting */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center">
            <select
              onChange={(e) => handleHeading(e.target.value)}
              className="h-8 px-3 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue=""
            >
              <option value="">Normal</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
            </select>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-1">
            {toolbarButtons.map(({ command, icon: Icon, label }) => (
              <button
                key={command}
                onClick={() => onCommand(command)}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                title={label}
                type="button"
              >
                <Icon size={14} className="text-gray-700" />
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <select
              value={fontFamily}
              onChange={(e) => handleFontFamily(e.target.value)}
              className="h-8 px-3 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Helvetica">Helvetica</option>
            </select>

            <select
              onChange={(e) => handleFontSize(e.target.value)}
              className="h-8 px-3 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        </div>

        {/* Second Row - Colors, Alignment, Lists, and Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600">Text</span>
              <input
                type="color"
                onChange={(e) => handleTextColor(e.target.value)}
                className="h-8 w-10 border border-gray-300 rounded cursor-pointer"
                title="Text Color"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600">Highlight</span>
              <input
                type="color"
                onChange={(e) => handleBackgroundColor(e.target.value)}
                className="h-8 w-10 border border-gray-300 rounded cursor-pointer"
                title="Background Color"
              />
            </div>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-1">
            {alignmentButtons.map(({ command, icon: Icon, label }) => (
              <button
                key={command}
                onClick={() => onCommand(command)}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                title={label}
                type="button"
              >
                <Icon size={14} className="text-gray-700" />
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-1">
            {listButtons.map(({ command, icon: Icon, label }) => (
              <button
                key={command}
                onClick={() => onCommand(command)}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                title={label}
                type="button"
              >
                <Icon size={14} className="text-gray-700" />
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-1">
            <button
              onClick={handleLink}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Insert Link"
              type="button"
            >
              <Link size={14} className="text-gray-700" />
            </button>

            <button
              onClick={() => setShowImageModal(true)}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Insert Image"
              type="button"
            >
              <Image size={14} className="text-gray-700" />
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Export Document"
              type="button"
            >
              <Download size={14} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsert={handleImageInsert}
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
