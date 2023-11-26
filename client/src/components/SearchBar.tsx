// components/SearchBar.tsx
import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Input } from './ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchContainer = styled.div`
  margin: 16px;
  text-align: center;
`;

const SearchInput = styled(Input)`
  padding: 8px;
  width: 300px;
`;

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </SearchContainer>
  );
};

export default SearchBar;
