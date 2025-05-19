import { ContentForm } from "@/features/content/ui/ContentForm"
import { Button } from "@/shared/ui/atoms/Button"
import { useNavigate } from "react-router-dom"

export default function NewContentPage() {
  const navigate = useNavigate()
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="flex items-center gap-2 rounded-full px-4 py-2" onClick={() => navigate(-1)}>
          <span className="text-lg">←</span>
          <span className="text-base">戻る</span>
        </Button>
        <h1 className="text-2xl font-bold">新規コンテンツ作成</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <ContentForm />
      </div>
    </div>
  )
} 