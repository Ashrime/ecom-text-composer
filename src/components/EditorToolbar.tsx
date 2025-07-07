
import React, { useRef } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ListOrdered, List, Link, Image } from 'lucide-react';

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onImageUpload: (file: File) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onCommand, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFontSize = (size: string) => {
    onCommand('fontSize', size);
  };

  const handleTextColor = (color: string) => {
    onCommand('foreColor', color);
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      onCommand('createLink', url);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
    e.target.value = '';
  };

  return (
    <div className="toolbar bg-gray-50 border-b border-gray-300 p-3 flex items-center gap-2 flex-wrap">
      {/* Basic Formatting */}
      <div className="flex items-center gap-1">
        {toolbarButtons.map(({ command, icon: Icon, label }) => (
          <button
            key={command}
            onClick={() => onCommand(command)}
            className="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
            title={label}
            type="button"
          >
            <Icon size={16} className="text-gray-700" />
          </button>
        ))}
      </div>

      <div className="separator w-px h-6 bg-gray-300" />

      {/* Font Size */}
      <select
        onChange={(e) => handleFontSize(e.target.value)}
        className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Text Color */}
      <input
        type="color"
        onChange={(e) => handleTextColor(e.target.value)}
        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
        title="Text Color"
      />

      <div className="separator w-px h-6 bg-gray-300" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        {alignmentButtons.map(({ command, icon: Icon, label }) => (
          <button
            key={command}
            onClick={() => onCommand(command)}
            className="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
            title={label}
            type="button"
          >
            <Icon size={16} className="text-gray-700" />
          </button>
        ))}
      </div>

      <div className="separator w-px h-6 bg-gray-300" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        {listButtons.map(({ command, icon: Icon, label }) => (
          <button
            key={command}
            onClick={() => onCommand(command)}
            className="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
            title={label}
            type="button"
          >
            <Icon size={16} className="text-gray-700" />
          </button>
        ))}
      </div>

      <div className="separator w-px h-6 bg-gray-300" />

      {/* Link and Image */}
      <button
        onClick={handleLink}
        className="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
        title="Insert Link"
        type="button"
      >
        <Link size={16} className="text-gray-700" />
      </button>

      <button
        onClick={handleImageClick}
        className="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
        title="Insert Image"
        type="button"
      >
        <Image size={16} className="text-gray-700" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default EditorToolbar;
