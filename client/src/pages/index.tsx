// pages/index.tsx
import { Inter } from "next/font/google"
import { Fragment, useState } from 'react'
import { ItemModel } from '../../../prisma/models/ItemModel';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/Header';

interface HomeProps {
  products: ItemModel[];
}

const inter = Inter({ subsets: ["latin"] })

const Home: React.FC<HomeProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState(initialProducts);

  const handleSearch = async (query: string) => {
    try {
      console.log(query);
      const response = await fetch(`http://localhost:3001/search/${query}`);
      console.log(response.status)
      if (response.ok) {
        const newProducts: ItemModel[] = await response.json();
        setProducts(newProducts);
        console.log(newProducts);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div
    className={`${inter.className} flex min-h-screen flex-col bg-background text-primary`}
  >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Header />
        <main>
        </main>
      </ThemeProvider>
      </div>
  );
};

export default Home;
