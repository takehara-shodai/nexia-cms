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
  category?: { name: string };
}

export const contentApi = {
  async getContents() {
    const { data, error } = await supabase
      .from('nexia_cms_contents')
      .select(`
        *,
        type:nexia_cms_content_types(name),
        status:nexia_cms_content_statuses(name, color),
        category:nexia_cms_categories(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getContent(id: string) {
    const { data, error } = await supabase
      .from('nexia_cms_contents')
      .select(`
        *,
        type:nexia_cms_content_types(name),
        status:nexia_cms_content_statuses(name, color),
        category:nexia_cms_categories(name)
      `)
      .eq('id', id)
      .single();

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