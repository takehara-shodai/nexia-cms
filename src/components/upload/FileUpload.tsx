import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, File, Image as ImageIcon, FileText, Film, Music, Archive, AlertCircle } from 'lucide-react';

type FileUploadProps = {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
};

interface FileWithPreview extends File {
  preview?: string;
}

const FileUpload = ({
  onFilesSelected,
  accept = '*',
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFiles = (fileList: FileWithPreview[]): boolean => {
    if (fileList.length > maxFiles) {
      setError(`アップロードできるファイル数は${maxFiles}個までです`);
      return false;
    }

    for (const file of fileList) {
      if (file.size > maxSize) {
        setError(`ファイルサイズは${maxSize / 1024 / 1024}MB以下にしてください`);
        return false;
      }

      if (accept !== '*' && !file.type.match(accept)) {
        setError('サポートされていないファイル形式です');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const processFiles = async (fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList) as FileWithPreview[];

    if (!validateFiles(newFiles)) {
      return;
    }

    // Generate previews for images
    for (const file of newFiles) {
      if (file.type.startsWith('image/')) {
        file.preview = URL.createObjectURL(file);
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
    onFilesSelected(newFiles);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon size={24} />;
    if (file.type.startsWith('video/')) return <Film size={24} />;
    if (file.type.startsWith('audio/')) return <Music size={24} />;
    if (file.type.startsWith('text/')) return <FileText size={24} />;
    if (file.type.includes('zip') || file.type.includes('archive')) return <Archive size={24} />;
    return <File size={24} />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
        />
        <div className="flex flex-col items-center">
          <Upload
            size={48}
            className={`mb-4 ${
              isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
          <p className="text-lg font-medium mb-2">
            ドラッグ＆ドロップまたはクリックしてファイルを選択
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {accept === '*'
              ? 'すべてのファイル形式に対応'
              : `対応形式: ${accept}`}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ファイルを選択
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium">アップロード予定のファイル</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {files.map((file, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {getFileIcon(file)}
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;