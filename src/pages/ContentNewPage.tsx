import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/atoms/Button";
import { Eye, Pencil, Trash2, Send, ArrowLeft } from "lucide-react";
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
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">新規コンテンツ作成</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2"
          >
            {isPreview ? (
              <>
                <Pencil size={18} />
                <span>編集</span>
              </>
            ) : (
              <>
                <Eye size={18} />
                <span>プレビュー</span>
              </>
            )}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            variant="primaryFilled"
            className="flex items-center gap-2"
          >
            <Send size={18} />
            <span>保存</span>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 size={18} />
            <span>削除</span>
          </Button>
        </div>
      </div>
      <ContentForm isPreview={isPreview} />
    </div>
  );
}