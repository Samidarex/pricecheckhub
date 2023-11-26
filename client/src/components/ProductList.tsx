import { ItemModel } from '../../../prisma/models/ItemModel';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: ItemModel[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div>
      {products?.map((product) => (
        <ProductCard key={product.name} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
