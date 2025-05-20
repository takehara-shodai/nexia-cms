import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/atoms/Button";
import { Eye, Pencil, Trash2, Send, ArrowLeft } from "lucide-react";
import { ContentForm } from "@/features/content/ui/ContentForm";

export default function ContentNewPage() {
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // ContentFormのhandleSubmitをrefで呼び出し
  const formRef = useRef<{ handleSubmit: () => void }>(null);

  // 保存ボタンでContentFormのhandleSubmitを呼ぶ
  const handleSave = () => {
    setIsLoading(true);
    formRef.current?.handleSubmit();
    setIsLoading(false);
  };

  return (
    <div className="fade-in">
        <div className="flex items-center gap-2 mb-3">
            <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
            戻る
            </Button>
            <h1 className="text-2xl font-bold">新規コンテンツ作成</h1>
            <div className="flex gap-2 ml-auto">
            <Button
                variant="outline"
                onClick={() => setIsPreview((prev) => !prev)}
                className="flex items-center gap-2"
            >
                {isPreview ? <Pencil className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                {isPreview ? "編集" : "プレビュー"}
            </Button>
            <Button
                onClick={handleSave}
                disabled={isLoading}
                variant="primaryFilled"
                className="flex items-center gap-2"
            >
                <Send className="w-5 h-5" /> 保存
            </Button>
            <Button
                type="button"
                variant="destructive"
                className="flex items-center gap-2 px-4"
                onClick={() => {/* 削除処理 */}}
            >
                <Trash2 className="w-5 h-5" /> 削除
            </Button>
            </div>
        </div>
        <ContentForm
            ref={formRef}
            isPreview={isPreview}
            onSuccess={() => navigate('/content')}
        />
    </div>
  );
}