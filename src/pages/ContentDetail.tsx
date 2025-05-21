import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/shared/ui/atoms/Button";
import { ContentForm } from '@/features/content/ui/ContentForm';
import { fetchContents } from '@/features/content/api/contentApi';
import { Content } from '@/features/content/types';

const ContentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<Content | null>(null);
  const formRef = useRef<{ handleSubmit: () => void }>(null);

  // コンテンツデータの読み込み
  useEffect(() => {
    const loadContent = async () => {
      if (!id) {
        console.error('No content ID provided');
        navigate('/content');
        return;
      }
      
      console.log('Loading content with ID:', id);
      
      try {
        setIsLoading(true);
        const contents = await fetchContents();
        console.log('Looking for content with ID:', id, 'in', contents.length, 'contents');
        
        // 文字列比較の前に両方のIDを正規化して比較
        const normalizeId = (idValue: string | undefined) => 
          idValue ? idValue.toLowerCase().replace(/-/g, '') : '';
        
        const normalizedSearchId = normalizeId(id);
        const found = contents.find(c => normalizeId(c.id) === normalizedSearchId);
        
        if (found) {
          console.log('Content found:', found);
          setContent(found);
        } else {
          console.error('Content not found with ID:', id);
          // コンテンツが見つからない場合は一覧に戻る
          navigate('/content');
        }
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [id, navigate]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Starting content update with content:', JSON.stringify(content, null, 2));
      
      // フォームの状態確認
      if (formRef.current) {
        console.log('Form reference exists');
        await formRef.current.handleSubmit();
        console.log('Content saved successfully');
      } else {
        console.error('Form reference is null - cannot submit');
        alert('フォームの参照が見つかりません。ページを再読み込みしてください。');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      
      // エラーの詳細情報を表示
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        alert(`保存中にエラーが発生しました: ${error.message}`);
      } else if (typeof error === 'object' && error !== null) {
        console.error('Error details:', JSON.stringify(error, null, 2));
        alert('保存中に不明なエラーが発生しました。コンソールを確認してください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Button variant="ghost" onClick={() => navigate('/content')}>
          <ArrowLeft className="w-5 h-5" />
          戻る
        </Button>
        <h1 className="text-2xl font-bold">コンテンツ編集</h1>
        
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

      {content ? (
        <>
          {/* Content情報をデバッグ表示 */}
          <div className="hidden">
            <pre>{JSON.stringify({
              id: content.id,
              status: content.status,
              status_id: content.status_id,
              type_id: content.type_id,
              tenant_id: content.tenant_id,
              author_id: content.author_id
            }, null, 2)}</pre>
          </div>
          
          <ContentForm
            ref={formRef}
            content={content}
            isPreview={isPreview}
            onSuccess={() => navigate('/content')}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      )}
    </div>
  );
};

export default ContentDetail;
