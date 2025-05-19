import { useState } from "react"
import { Button } from "@/shared/ui/atoms/Button"
import { Input } from "@/shared/ui/atoms/Input"
import { Textarea } from "@/shared/ui/atoms/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/Select"
import { Card, CardContent } from "@/shared/ui/molecules/Card"
import { Badge } from "@/shared/ui/atoms/Badge"
import { Label } from "@/shared/ui/atoms/Label"
import { supabase } from "@/lib/supabase"

interface ContentType {
  id?: string;
  title?: string;
  content?: string;
  status?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export function ContentForm({ content = null }: { content?: ContentType | null }) {
  const [isEditing, setIsEditing] = useState(content ? false : true)
  const [formData, setFormData] = useState({
    title: content?.title || "",
    content: content?.content || "",
    status: content?.status || "draft",
    tags: content?.tags || [],
  })
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div>
              <Label htmlFor="title" className="mb-2 block">タイトル</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="タイトルを入力"
                className="text-lg font-medium bg-white"
              />
            </div>
            <div>
              <Label htmlFor="content" className="mb-2 block">本文</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="ここに記事の本文が入ります..."
                rows={12}
                className="bg-white resize-none"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <Label className="mb-3 block">ステータス</Label>
              {isEditing || !content ? (
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">公開</SelectItem>
                    <SelectItem value="draft">下書き</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="success">{formData.status === 'published' ? '公開' : '下書き'}</Badge>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <Label className="mb-3 block">タグ</Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    {(isEditing || !content) && (
                      <button 
                        onClick={() => handleRemoveTag(tag)} 
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {(isEditing || !content) && (
                <div className="flex items-center gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="新しいタグ"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddTag} 
                    variant="outline"
                  >
                    追加
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
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
        </div>
      </CardContent>
    </Card>
  )
}