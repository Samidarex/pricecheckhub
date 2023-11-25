import React from 'react';

interface SearchResultProps {
  items: string[]; 
}

const SearchResult: React.FC<SearchResultProps> = ({ items }) => {
  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResult;
