import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';

function ContentDrafts() {
  const { data: drafts, isLoading, error } = useQuery(['drafts'], contentApi.getDrafts);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading drafts</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">下書き一覧</h1>
      <div className="grid gap-4">
        {drafts?.map((draft) => (
          <div key={draft.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">{draft.title}</h2>
            <p className="text-gray-600">{draft.excerpt}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-500">
                最終更新: {new Date(draft.updated_at).toLocaleDateString('ja-JP')}
              </span>
              <span
                className="px-2 py-1 rounded text-sm"
                style={{
                  backgroundColor: draft.status?.color || '#e5e7eb',
                  color: '#ffffff',
                }}
              >
                {draft.status?.name || 'ステータスなし'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentDrafts;