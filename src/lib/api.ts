import { supabase } from './supabase';

export interface Content {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  type_id: string;
  status_id: string;
  category_id: string | null;
  author_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  // Joined table information
  type?: { name: string };
  status?: { name: string; color: string };
}

export const contentApi = {
  async getContents() {
    const { data, error } = await supabase
      .from('nexia_cms_contents')
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        featured_image,
        type_id,
        status_id,
        category_id,
        author_id,
        published_at,
        created_at,
        updated_at,
        metadata,
        type:nexia_cms_content_types(id, name),
        status:nexia_cms_content_statuses(id, name, color)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getContent(id: string) {
    const { data, error } = await supabase
      .from('nexia_cms_contents')
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        featured_image,
        type_id,
        status_id,
        category_id,
        author_id,
        published_at,
        created_at,
        updated_at,
        metadata,
        type:nexia_cms_content_types(id, name),
        status:nexia_cms_content_statuses(id, name, color)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getDrafts() {
    // First, get the draft status ID
    const { data: statusData, error: statusError } = await supabase
      .from('nexia_cms_content_statuses')
      .select('id')
      .eq('name', 'draft')
      .single();

    if (statusError) throw statusError;
    if (!statusData) throw new Error('Draft status not found');

    // Then use the draft status ID to query contents
    const { data, error } = await supabase
      .from('nexia_cms_contents')
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        featured_image,
        type_id,
        status_id,
        category_id,
        author_id,
        published_at,
        created_at,
        updated_at,
        metadata,
        type:nexia_cms_content_types(id, name),
        status:nexia_cms_content_statuses(id, name, color)
      `)
      .eq('status_id', statusData.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createContent(content: Partial<Content>) {
    const { data, error } = await supabase
      .from('nexia_cms_contents')
      .insert([content])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateContent(id: string, content: Partial<Content>) {
    const { data, error } = await supabase
      .from('nexia_cms_contents')
      .update(content)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteContent(id: string) {
    const { error } = await supabase
      .from('nexia_cms_contents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};