export type ContentStatus = 'draft' | 'published' | 'archived';
export type ContentType = 'article' | 'report' | 'guide';

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  author: string;
  updatedAt: string;
  createdAt: string;
  publishedAt?: string;
  dueDate?: string;
  description?: string;
  url?: string;
  views?: number;
  likes?: number;
  comments?: number;
}

export interface ContentListFilters {
  status: ContentStatus | 'all';
  searchTerm: string;
  viewMode: 'list' | 'grid';
} 