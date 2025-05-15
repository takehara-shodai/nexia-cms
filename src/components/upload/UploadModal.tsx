import { X } from 'lucide-react';
import FileUpload from './FileUpload';

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
          <FileUpload
            onFilesSelected={onUpload}
            accept="image/*"
            multiple={true}
            maxSize={5 * 1024 * 1024} // 5MB
            maxFiles={10}
          />
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            完了
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;