import { forwardRef, useImperativeHandle } from "react"
import { Input } from "@/shared/ui/atoms/Input"
import { Textarea } from "@/shared/ui/atoms/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/Select"
import { Card, CardContent } from "@/shared/ui/molecules/Card"
import { Badge } from "@/shared/ui/atoms/Badge"
import { Label } from "@/shared/ui/atoms/Label"
import { useContentForm } from '@/features/content/model/useContentForm'
import { TagSelect } from '@/shared/ui/molecules/TagSelect'
import { useAuth } from '@/shared/hooks/useAuth'
import type { ContentStatus, Tag } from '@/features/content/types';

interface ContentType {
  id?: string;
  title?: string;
  content?: string;
  status?: ContentStatus;
  tags?: Tag[];
  created_at?: string;
  updated_at?: string;
}

interface ContentFormProps {
  content?: ContentType | null;
  isPreview?: boolean;
  onSuccess?: (content: ContentType) => void;
}

const statusOptions: { value: ContentStatus; label: string; color: string }[] = [
  { value: 'draft' as ContentStatus, label: '下書き', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'review' as ContentStatus, label: 'レビュー中', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'published' as ContentStatus, label: '公開', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'archived' as ContentStatus, label: 'アーカイブ', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
];

export const ContentForm = forwardRef(function ContentForm({ isPreview = false, onSuccess }: ContentFormProps, ref) {
  const { form, handleChange, handleSubmit } = useContentForm(onSuccess);
  const { user } = useAuth();
  const tenant_id = user?.tenant_id || '';

  useImperativeHandle(ref, () => ({ handleSubmit }));

  const getStatusColor = (status: string) => {
    return statusOptions.find(option => option.value === status)?.color || statusOptions[0].color;
  }

  const getStatusLabel = (status: string) => {
    return statusOptions.find(option => option.value === status)?.label || status;
  }

  if (isPreview) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
                <div className="prose dark:prose-invert max-w-none">
                  {form.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h2 className="font-medium mb-3">ステータス</h2>
                <Badge className={getStatusColor(form.status)}>
                  {getStatusLabel(form.status)}
                </Badge>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h2 className="font-medium mb-3">タグ</h2>
                <div className="flex flex-wrap gap-2">
                  {form.tags?.map((tag: Tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h2 className="font-medium mb-3">メタデータ</h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">作成者</div>
                    <div className="font-medium">山田太郎</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">作成日</div>
                    <div className="font-medium">2024-03-01</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">最終更新日</div>
                    <div className="font-medium">2024-03-10</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <form className="grid grid-cols-3 gap-6" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <div className="col-span-2 space-y-6">
            <div>
              <Label htmlFor="title" className="mb-2 block">タイトル</Label>
              <Input
                id="title"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="タイトルを入力"
                className="text-lg font-medium bg-white dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <Label htmlFor="content" className="mb-2 block">本文</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={e => handleChange('content', e.target.value)}
                placeholder="ここに記事の本文が入ります..."
                rows={12}
                className="bg-white dark:bg-gray-700 resize-none"
                required
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <Label className="mb-3 block">ステータス</Label>
              <Select 
                value={form.status} 
                onValueChange={(value) => handleChange('status', value as ContentStatus)}              >
                <SelectTrigger className="w-full bg-white dark:bg-gray-700">
                  <SelectValue placeholder="ステータスを選択">
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(form.status)}`}>
                      {getStatusLabel(form.status)}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700">
                  {statusOptions.map(option => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="flex items-center gap-2"
                    >
                      <span className={`px-2 py-0.5 rounded text-xs ${option.color}`}>
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <Label className="mb-3 block">タグ</Label>
              <TagSelect
                value={form.tags || []}
                onChange={tags => handleChange('tags', tags)}
                tenant_id={tenant_id}
              />
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <Label className="mb-3 block">メタデータ</Label>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">作成者</div>
                  <div className="font-medium">山田太郎</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">作成日</div>
                  <div className="font-medium">2024-03-01</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">最終更新日</div>
                  <div className="font-medium">2024-03-10</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
});