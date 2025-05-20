export type ContentStatus = 'draft' | 'published' | 'archived';
export type ContentType = 'article' | 'report' | 'guide';

export interface Tag {
  id: string;
  name: string;
  color?: string;
  created_at?: string;
}

export interface ContentTag {
  content_id: string;
  tag_id: string;
}

export interface Content {
  id?: string;
  title: string;
  content: string;
  status: ContentStatus;
  slug: string;
  tags?: Tag[];
  created_at?: string;
  updated_at?: string;
  author_id?: string;
  type?: ContentType;
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