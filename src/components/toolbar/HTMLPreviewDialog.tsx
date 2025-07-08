
import React from 'react';
import { X } from 'lucide-react';

interface HTMLPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
}

const HTMLPreviewDialog: React.FC<HTMLPreviewDialogProps> = ({
  isOpen,
  onClose,
  htmlContent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] w-full mx-4 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">HTML Preview</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div>
              <h4 className="font-medium mb-2">HTML Code:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto h-64 md:h-full">
                <code>{htmlContent}</code>
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Preview:</h4>
              <div 
                className="border border-gray-300 p-3 rounded h-64 md:h-full overflow-auto"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTMLPreviewDialog;
