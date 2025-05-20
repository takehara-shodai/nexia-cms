import { useState } from 'react';
import { Tag } from '@/features/content/types';
import { useTagSelect } from '@/features/content/model/useTagSelect';
import { Input } from '@/shared/ui/atoms/Input';
import { Button } from '@/shared/ui/atoms/Button';

interface TagSelectProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  tenant_id: string;
}

export function TagSelect({ value, onChange, tenant_id }: TagSelectProps) {
  const { tags, loading, addTag } = useTagSelect(tenant_id);
  const [input, setInput] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!input.trim()) return;
    setAdding(true);
    try {
      const newTag = await addTag(input.trim());
      onChange([...value, newTag]);
      setInput('');
    } finally {
      setAdding(false);
    }
  };

  const handleSelect = (tag: Tag) => {
    if (!value.find(t => t.id === tag.id)) {
      onChange([...value, tag]);
    }
  };

  const handleRemove = (tag: Tag) => {
    onChange(value.filter(t => t.id !== tag.id));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(tag => (
          <span key={tag.id} className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
            {tag.name}
            <button 
              type="button" 
              className="ml-2 text-gray-500 hover:text-red-500 transition-colors" 
              onClick={() => handleRemove(tag)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="新しいタグ"
          className="flex-1"
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
        />
        <Button 
          type="button" 
          onClick={handleAdd} 
          variant="primaryFilled"
          disabled={adding || !tenant_id || !input.trim()}
          className="px-4"
        >
          追加
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.filter(tag => !value.find(t => t.id === tag.id)).map(tag => (
          <Button
            key={tag.id}
            type="button"
            variant="outline"
            onClick={() => handleSelect(tag)}
            className="px-3 py-1 h-auto text-sm bg-white dark:bg-gray-800"
          >
            {tag.name}
          </Button>
        ))}
      </div>
    </div>
  );
}