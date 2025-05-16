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
  type?: { id: string; name: string };
  status?: { id: string; name: string; color: string };
  url?: string;
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
        type:nexia_cms_content_types!type_id(id, name),
        status:nexia_cms_content_statuses!status_id(id, name, color)
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
        type:nexia_cms_content_types!type_id(id, name),
        status:nexia_cms_content_statuses!status_id(id, name, color)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getContentsByStatus(statusName: string) {
    // First get the status ID from the status name
    const { data: statusData, error: statusError } = await supabase
      .from('nexia_cms_content_statuses')
      .select('id')
      .eq('name', statusName)
      .single();

    if (statusError) {
      // If status not found, return empty array
      if (statusError.code === 'PGRST116') {
        return [];
      }
      throw statusError;
    }

    // Then get contents with that status ID
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
        type:nexia_cms_content_types!type_id(id, name),
        status:nexia_cms_content_statuses!status_id(id, name, color)
      `)
      .eq('status_id', statusData.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createContent(content: Partial<Content>) {
    const { data, error } = await supabase
      .from('nexia_cms_contents')
      .insert([content])
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
        type:nexia_cms_content_types!type_id(id, name),
        status:nexia_cms_content_statuses!status_id(id, name, color)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async updateContent(id: string, content: Partial<Content>) {
    const { data, error } = await supabase
      .from('nexia_cms_contents')
      .update(content)
      .eq('id', id)
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
        type:nexia_cms_content_types!type_id(id, name),
        status:nexia_cms_content_statuses!status_id(id, name, color)
      `)
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