export type ContentStatus = 'draft' | 'published' | 'archived';
export type ContentType = 'article' | 'report' | 'guide';

export interface Tag {
  id: string;
  name: string;
  color?: string;
  tenant_id?: string | null;
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
  status_id: string;
  slug?: string; // データベースにはない、オプショナルに変更
  type_id: string;
  tenant_id?: string | null; // nullも許容
  author_id?: string | null; // nullも許容
  tags?: Tag[];
  created_at?: string;
  updated_at?: string;
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
