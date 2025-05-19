import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/shared/ui/atoms/Button"
import { Input } from "@/shared/ui/atoms/Input"
import { Textarea } from "@/shared/ui/atoms/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/Select"
import { Card, CardHeader, CardContent } from "@/shared/ui/molecules/Card"
import { Badge } from "@/shared/ui/atoms/Badge"
import { Label } from "@/shared/ui/atoms/Label"
import { supabase } from "@/lib/supabase"
import { Eye, Trash2, Send } from "lucide-react"

// 簡易的な通知機能
const notify = {
  success: (message: string) => {
    console.log(`✅ ${message}`)
    alert(`✅ ${message}`)
  },
  error: (message: string) => {
    console.error(`❌ ${message}`)
    alert(`❌ ${message}`)
  }
}

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
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(content ? false : true)
  const [formData, setFormData] = useState({
    title: content?.title || "",
    content: content?.content || "",
    status: content?.status || "draft",
    tags: content?.tags || [],
  })
  const [newTag, setNewTag] = useState("")

  const statusLabels: Record<string, string> = {
    draft: "下書き",
    published: "公開中",
    archived: "アーカイブ"
  }

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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsLoading(true)
    console.log('フォーム送信:', formData)

    try {
      const { data, error } = await supabase
        .from('nexia-cms-contents')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            status: formData.status,
            tags: formData.tags
          },
        ])
        .select()

      if (error) {
        console.error('Supabaseエラー:', error)
        throw new Error(`コンテンツの作成に失敗しました: ${error.message}`)
      }

      console.log('作成成功:', data)
      notify.success("コンテンツを作成しました")
      navigate("/content")
    } catch (error) {
      notify.error(`エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
      console.error('詳細エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-5xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          {content && <span className="ml-4 text-xs text-muted-foreground">ID: {content.id || "create"}</span>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
            className="flex items-center gap-2 text-base font-medium h-12 px-8 rounded-lg"
          >
            <Eye className="w-5 h-5" /> 編集
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isEditing || isLoading}
            variant="primaryFilled"
            className="flex items-center gap-2 text-base font-medium h-12 px-8 rounded-lg"
          >
            <Send className="w-5 h-5" /> 保存
          </Button>
          <Button variant="destructive" size="icon" className="w-12 h-12 rounded-lg flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div>
              <Label htmlFor="title" className="mb-1">タイトル</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="タイトルを入力"
                disabled={!isEditing && !!content}
                className="text-2xl font-bold bg-white"
              />
            </div>
            <div>
              <Label htmlFor="content" className="mb-1">本文</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="ここに記事の本文が入ります..."
                rows={6}
                disabled={!isEditing && !!content}
                className="bg-white"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-4">
              <Label className="mb-2 block">ステータス</Label>
              {isEditing || !content ? (
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">公開中</SelectItem>
                    <SelectItem value="draft">下書き</SelectItem>
                    <SelectItem value="archived">アーカイブ</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="success">{statusLabels[formData.status]}</Badge>
              )}
            </div>
            <div className="bg-muted rounded-lg p-4">
              <Label className="mb-2 block">タグ</Label>
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
                    className="h-8"
                  />
                  <Button 
                    onClick={handleAddTag} 
                    className="h-8" 
                    variant="outline"
                  >
                    追加
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-muted rounded-lg p-4">
              <Label className="mb-2 block">メタデータ</Label>
              <div className="text-sm text-muted-foreground">作成者</div>
              <div className="mb-2">山田太郎</div>
              <div className="text-sm text-muted-foreground">作成日</div>
              <div className="mb-2">2024-03-01</div>
              <div className="text-sm text-muted-foreground">最終更新日</div>
              <div>2024-03-10</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}