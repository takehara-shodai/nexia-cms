import { z } from 'zod';

export const contentSchema = z.object({
  title: z.string().min(1, '必須項目です'),
  type_id: z.string().min(1, 'コンテンツタイプを選択してください'),
  status_id: z.string().min(1, 'ステータスを選択してください'),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  featured_image: z.string().optional(),
  category_id: z.string().optional(),
  published_at: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type ContentFormData = z.infer<typeof contentSchema>;