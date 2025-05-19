import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/atoms/Button";
import { Eye, Trash2, Send } from "lucide-react";
import { ContentForm } from "@/features/content/ui/ContentForm";

export default function ContentNewPage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 保存・削除などのロジックはここで管理
  const handleSave = () => { /* 保存処理 */ };
  const handleDelete = () => { /* 削除処理 */ };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="flex items-center gap-2 rounded-full px-4 py-2" onClick={() => navigate(-1)}>
          <span className="text-lg">←</span>
          <span className="text-base">戻る</span>
        </Button>
        <h1 className="text-2xl font-bold">新規コンテンツ作成</h1>
      </div>
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          onClick={() => setIsEditing(true)}
          disabled={isEditing}
          className="flex items-center gap-2 text-base font-medium h-12 px-8 rounded-lg"
        >
          <Eye className="w-5 h-5" /> 編集
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isEditing || isLoading}
          variant="primaryFilled"
          className="flex items-center gap-2 text-base font-medium h-12 px-8 rounded-lg"
        >
          <Send className="w-5 h-5" /> 保存
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          onClick={handleDelete}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <ContentForm />
      </div>
    </div>
  );
} 