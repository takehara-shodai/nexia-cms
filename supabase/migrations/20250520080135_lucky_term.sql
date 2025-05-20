/*
  # Add default content type

  1. New Data
    - Add a default 'Article' content type to nexia_cms_content_types table
    
  2. Changes
    - Insert default content type with a specific UUID
*/

INSERT INTO nexia_cms_content_types (id, name, description, schema)
VALUES (
  'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb',
  'Article',
  'Default article content type',
  '{
    "fields": [
      {
        "name": "title",
        "type": "text",
        "required": true
      },
      {
        "name": "content",
        "type": "richtext",
        "required": true
      }
    ]
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;