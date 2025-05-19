import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, Send, ArrowLeft } from "lucide-react";
import { ActionButton } from "@/shared/ui/molecules/ActionButton";
import { ContentForm } from "@/features/content/ui/ContentForm";

export default function ContentNewPage() {
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save logic here
      navigate('/content');
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (confirm('下書きを削除してもよろしいですか？')) {
      navigate('/content');
    }
  };

  return (
    <div className="fade-in container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <ActionButton
            icon={ArrowLeft}
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            戻る
          </ActionButton>
          <h1 className="text-2xl font-bold">新規コンテンツ作成</h1>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton
            icon={isPreview ? Pencil : Eye}
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? '編集' : 'プレビュー'}
          </ActionButton>
          <ActionButton
            icon={Send}
            variant="primaryFilled"
            onClick={handleSave}
            disabled={isLoading}
          >
            保存
          </ActionButton>
          <ActionButton
            icon={Trash2}
            variant="destructive"
            onClick={handleDelete}
          >
            削除
          </ActionButton>
        </div>
      </div>
      <div className="slide-in">
        <ContentForm isPreview={isPreview} />
      </div>
    </div>
  );
}