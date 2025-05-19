import { ContentForm } from "@/components/content/content-form"

export default function NewContentPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">新規コンテンツ作成</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ContentForm />
      </div>
    </div>
  )
} 