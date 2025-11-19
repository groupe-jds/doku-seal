'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@doku-seal/ui/primitives/input';

type DocumentSearchProps = {
  initialValue?: string;
  onSearch: (query: string) => void;
};

export function DocumentSearch({ initialValue = '', onSearch }: DocumentSearchProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    // Debounce would be ideal here, but for simplicity we'll search immediately
    onSearch(newValue);
  };

  return (
    <div className="relative w-full">
      <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
      <Input
        type="search"
        placeholder="Search documents..."
        value={value}
        onChange={handleChange}
        className="pl-9"
      />
    </div>
  );
}
