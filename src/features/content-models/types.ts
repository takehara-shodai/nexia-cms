export interface ContentModel {
  id: string;
  tenant_id: string | null;
  name: string;
  slug: string | null;
  description?: string;
  settings: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface ContentField {
  id: string;
  model_id: string;
  name: string;
  type: FieldType;
  required: boolean;
  settings: Record<string, unknown>;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

export type FieldType = 
  | 'text'
  | 'number' 
  | 'boolean'
  | 'date'
  | 'image'
  | 'richtext'
  | 'array'
  | 'relation'
  | 'json';
