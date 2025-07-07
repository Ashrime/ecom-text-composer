
import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onResize: (width: number, height: number) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onCommand, onResize }) => {
  const toolbarButtons = [
    { command: 'bold', icon: Bold, label: 'Bold' },
    { command: 'italic', icon: Italic, label: 'Italic' },
    { command: 'underline', icon: Underline, label: 'Underline' },
    { command: 'justifyLeft', icon: AlignLeft, label: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, label: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, label: 'Align Right' },
  ];

  const handleResize = (size: 'small' | 'medium' | 'large') => {
    const sizes = {
      small: { width: 600, height: 300 },
      medium: { width: 800, height: 400 },
      large: { width: 1000, height: 500 }
    };
    onResize(sizes[size].width, sizes[size].height);
  };

  return (
    <div className="toolbar bg-gray-50 border-b border-gray-300 p-2 flex items-center gap-1">
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
      
      <div className="separator w-px h-6 bg-gray-300 mx-2" />
      
      <div className="resize-controls flex gap-1">
        <button
          onClick={() => handleResize('small')}
          className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors duration-200"
          type="button"
        >
          S
        </button>
        <button
          onClick={() => handleResize('medium')}
          className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors duration-200"
          type="button"
        >
          M
        </button>
        <button
          onClick={() => handleResize('large')}
          className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors duration-200"
          type="button"
        >
          L
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
