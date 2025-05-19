import { useState, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/shared/ui/atoms/Button"
import { Input } from "@/shared/ui/atoms/Input"
import { Textarea } from "@/shared/ui/atoms/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/Select"
import { Card, CardContent } from "@/shared/ui/molecules/Card"
import { Badge } from "@/shared/ui/atoms/Badge"
import { Label } from "@/shared/ui/atoms/Label"
import { supabase } from "@/lib/supabase"
import { useContentForm } from '@/features/content/model/useContentForm'

interface ContentType {
  id?: string;
  title?: string;
  content?: string;
  status?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

interface ContentFormProps {
  content?: ContentType | null;
  isPreview?: boolean;
  onSuccess?: (content: any) => void;
}

const statusOptions = [
  { value: 'draft', label: '下書き', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'review', label: 'レビュー中', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'published', label: '公開', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'archived', label: 'アーカイブ', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
];

export const ContentForm = forwardRef(function ContentForm({ content = null, isPreview = false, onSuccess }: ContentFormProps, ref) {
  const { form, handleChange, handleSubmit, loading } = useContentForm(onSuccess);
  const [newTag, setNewTag] = useState("")

  useImperativeHandle(ref, () => ({ handleSubmit }));

  const handleAddTag = () => {
    if (newTag && !form.tags.includes(newTag)) {
      handleChange('tags', [...form.tags, newTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange('tags', form.tags.filter(tag => tag !== tagToRemove))
  }

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
                <h3 className="font-medium mb-3">ステータス</h3>
                <Badge className={getStatusColor(form.status)}>
                  {getStatusLabel(form.status)}
                </Badge>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium mb-3">タグ</h3>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium mb-3">メタデータ</h3>
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
                onValueChange={(value) => handleChange('status', value)}
              >
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
              <div className="flex flex-wrap gap-2 mb-4">
                {form.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)} 
                      className="ml-1 text-gray-500 hover:text-red-500"
                      type="button"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="新しいタグ"
                  className="flex-1 bg-white dark:bg-gray-700"
                />
                <Button 
                  onClick={handleAddTag} 
                  variant="outline"
                  className="bg-white dark:bg-gray-700"
                  type="button"
                >
                  追加
                </Button>
              </div>
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