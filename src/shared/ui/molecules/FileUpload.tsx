import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  Upload,
  X,
  File,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Archive,
  AlertCircle,
} from 'lucide-react';

type FileUploadProps = {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
};

const FileUpload = ({ onFilesSelected, accept, multiple = false, maxSize, maxFiles }: FileUploadProps) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (validateFiles(files)) {
      onFilesSelected(files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (validateFiles(files)) {
      onFilesSelected(files);
    }
  };

  const validateFiles = (files: File[]) => {
    if (maxFiles && files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return false;
    }

    for (const file of files) {
      if (maxSize && file.size > maxSize) {
        alert(`File ${file.name} exceeds the maximum size of ${maxSize / 1024 / 1024} MB.`);
        return false;
      }
    }

    return true;
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 ${dragging ? 'border-blue-500' : 'border-gray-300'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <Upload size={32} className="text-gray-400" />
        <p className="text-sm text-gray-500">Drag and drop files here, or click to select files</p>
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => fileInputRef.current?.click()}
        >
          Select Files
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileUpload;
