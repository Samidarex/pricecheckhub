import React, { useState } from 'react';
import { TextFieldInput } from '@radix-ui/themes';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div>
      <img src="/image.jpg" alt="image" style={{ maxWidth: '100%', marginBottom: 16 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextFieldInput
          value={query}
          onInput={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search for items..."
          style={{ width: 300, marginBottom: 16 }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 16px', fontSize: '1rem', cursor: 'pointer' }}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
