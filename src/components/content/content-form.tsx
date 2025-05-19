import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

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
  const [isEditing, setIsEditing] = useState(false)
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
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <div className="flex items-center space-x-2">
            <button onClick={() => navigate(-1)} className="p-2">
              ←
            </button>
            <h1 className="text-2xl font-bold">
              {content ? "コンテンツ詳細" : "新規コンテンツ作成"}
            </h1>
          </div>
          {content && <p className="text-gray-500">ID: {content.id || "create"}</p>}
        </div>
        <div className="flex space-x-2">
          {content ? (
            <>
              {isEditing ? (
                <Button onClick={() => setIsEditing(false)}>キャンセル</Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <span className="mr-2">✏️</span>編集
                </Button>
              )}
              <Button disabled={!isEditing}>
                <span className="mr-2">💾</span>保存
              </Button>
              <Button variant="destructive">
                <span className="mr-2">🗑️</span>
              </Button>
            </>
          ) : (
            <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
              <span className="mr-2">💾</span>{isLoading ? "保存中..." : "保存"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          {/* タイトルと本文エリア */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {isEditing || !content ? (
              <>
                <div className="space-y-2">
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="タイトルを入力"
                    className="text-2xl font-bold border-none focus:ring-0 p-0"
                  />
                </div>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="ここに記事の本文が入ります..."
                  className="min-h-[200px] border-none focus:ring-0 p-0 text-gray-700"
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">{formData.title}</h2>
                <p className="text-gray-700">{formData.content || "ここに記事の本文が入ります..."}</p>
              </>
            )}
          </div>

          {/* タグエリア */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="font-medium mb-4">タグ</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag: string) => (
                <div key={tag} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                  <span>{tag}</span>
                  {(isEditing || !content) && (
                    <button 
                      onClick={() => handleRemoveTag(tag)} 
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {(isEditing || !content) && (
                <div className="flex items-center">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="新しいタグ"
                    className="w-32 h-8"
                  />
                  <Button 
                    onClick={handleAddTag} 
                    className="ml-2 h-8" 
                    variant="outline"
                  >
                    追加
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          {/* ステータスエリア */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium mb-4">ステータス</h3>
            {isEditing || !content ? (
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ステータスを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">下書き</SelectItem>
                  <SelectItem value="published">公開</SelectItem>
                  <SelectItem value="archived">アーカイブ</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className={`inline-block px-3 py-1 rounded-full text-sm
                ${formData.status === 'published' ? 'bg-green-100 text-green-800' : 
                formData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'}`}
              >
                {statusLabels[formData.status] || formData.status}
              </div>
            )}
          </div>

          {/* メタデータエリア */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium mb-4">メタデータ</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-2 w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">
                  👤
                </div>
                <div>
                  <div className="text-sm text-gray-500">作成者</div>
                  <div>山田太郎</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-2 w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">
                  📅
                </div>
                <div>
                  <div className="text-sm text-gray-500">作成日</div>
                  <div>{content?.created_at || new Date().toISOString().split('T')[0]}</div>
                </div>
              </div>
              {content?.updated_at && (
                <div className="flex items-center">
                  <div className="mr-2 w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">
                    🔄
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">最終更新日</div>
                    <div>{content.updated_at.split('T')[0]}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 