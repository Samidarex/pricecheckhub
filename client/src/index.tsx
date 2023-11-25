import React, { useState } from 'react';
import Head from 'next/head';
import SearchBar from './components/SearchBar';
import SearchResult from './components/SearchResult';

const Home: React.FC = () => {
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`http://localhost:3001/search/${query}`);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div>
      <Head>
        <title>Search App</title>
        <meta name="description" content="Search App using Next.js and Radix UI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <SearchBar onSearch={handleSearch} />
        <SearchResult items={searchResults} />
      </main>
    </div>
  );
};

export default Home;