
import React, { useRef, useState } from 'react';
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

  const handleImageInsert = (imageData: { src: string; width: number; height: number; alt: string }) => {
    const img = `<img src="${imageData.src}" width="${imageData.width}" height="${imageData.height}" alt="${imageData.alt}" style="max-width: 100%; height: auto;" />`;
    onCommand('insertHTML', img);
  };

  return (
    <>
      <div className="bg-gray-50 border-b border-gray-300 p-3 flex items-center gap-2 flex-wrap">
        {/* Headings */}
        <div className="flex items-center gap-1">
          <select
            onChange={(e) => handleHeading(e.target.value)}
            className="text-sm px-2 py-1 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="">Heading</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
            <option value="4">H4</option>
          </select>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Basic Formatting */}
        <div className="flex items-center gap-1">
          {toolbarButtons.map(({ command, icon: Icon, label }) => (
            <button
              key={command}
              onClick={() => onCommand(command)}
              className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center border border-transparent hover:border-gray-300"
              title={label}
              type="button"
            >
              <Icon size={16} className="text-gray-700" />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Font Family */}
        <select
          value={fontFamily}
          onChange={(e) => handleFontFamily(e.target.value)}
          className="text-sm px-2 py-1 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
          <option value="Helvetica">Helvetica</option>
        </select>

        {/* Font Size */}
        <select
          onChange={(e) => handleFontSize(e.target.value)}
          className="text-sm px-2 py-1 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className="w-px h-6 bg-gray-300" />

        {/* Colors */}
        <div className="flex items-center gap-1">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Text</label>
            <input
              type="color"
              onChange={(e) => handleTextColor(e.target.value)}
              className="w-8 h-6 border border-gray-300 rounded cursor-pointer bg-white"
              title="Text Color"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">BG</label>
            <input
              type="color"
              onChange={(e) => handleBackgroundColor(e.target.value)}
              className="w-8 h-6 border border-gray-300 rounded cursor-pointer bg-white"
              title="Background Color"
            />
          </div>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          {alignmentButtons.map(({ command, icon: Icon, label }) => (
            <button
              key={command}
              onClick={() => onCommand(command)}
              className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center border border-transparent hover:border-gray-300"
              title={label}
              type="button"
            >
              <Icon size={16} className="text-gray-700" />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          {listButtons.map(({ command, icon: Icon, label }) => (
            <button
              key={command}
              onClick={() => onCommand(command)}
              className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center border border-transparent hover:border-gray-300"
              title={label}
              type="button"
            >
              <Icon size={16} className="text-gray-700" />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Link and Image */}
        <button
          onClick={handleLink}
          className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center border border-transparent hover:border-gray-300"
          title="Insert Link"
          type="button"
        >
          <Link size={16} className="text-gray-700" />
        </button>

        <button
          onClick={() => setShowImageModal(true)}
          className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center border border-transparent hover:border-gray-300"
          title="Insert Image"
          type="button"
        >
          <Image size={16} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Export */}
        <button
          onClick={() => setShowExportModal(true)}
          className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center border border-transparent hover:border-gray-300"
          title="Export Document"
          type="button"
        >
          <Download size={16} className="text-gray-700" />
        </button>
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
