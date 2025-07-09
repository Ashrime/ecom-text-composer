
import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (linkData: {
    url: string;
    selectedText: string;
    openInNewTab: boolean;
  }) => void;
}

const LinkDialog: React.FC<LinkDialogProps> = ({ isOpen, onClose, onInsert }) => {
  const [url, setUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    if (isOpen) {
      const selection = window.getSelection();
      const selectedContent = selection?.toString() || '';
      setSelectedText(selectedContent);
      console.log('Selected text for link:', selectedContent);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    console.log('Inserting link with data:', { url: finalUrl, selectedText: selectedText.trim(), openInNewTab });

    onInsert({
      url: finalUrl,
      selectedText: selectedText.trim(),
      openInNewTab
    });

    // Reset form
    setUrl('');
    setOpenInNewTab(true);
    onClose();
  };

  const handleClose = () => {
    setUrl('');
    setOpenInNewTab(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Insert Link</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedText && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Selected text:</strong> "{selectedText}"
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This text will become a clickable link
              </p>
            </div>
          )}

          {!selectedText && (
            <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800">
                Please select some text first to convert it into a link
              </p>
            </div>
          )}

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL *
            </label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="newTab"
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="newTab" className="text-sm text-gray-700 flex items-center gap-1">
              Open in new tab
              <ExternalLink size={14} className="text-gray-500" />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedText || !url.trim()}
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Create Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkDialog;
