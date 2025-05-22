import { X } from 'lucide-react';
import FileUpload from '@/shared/ui/molecules/FileUpload';

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
};

const UploadModal = ({ isOpen, onClose, onUpload }: UploadModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium">ファイルアップロード</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <FileUpload onFilesSelected={onUpload} />
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
