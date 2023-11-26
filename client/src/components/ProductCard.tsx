// components/ProductCard.tsx
import { Box } from '@radix-ui/themes';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import styled from 'styled-components';
import { Label } from "@/components/ui/label"
import { ItemModel } from '../../../prisma/models/ItemModel';

interface ProductCardProps {
  product: ItemModel;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <>
    <Card>
      <CardHeader>
      </CardHeader>
      <CardContent>

      </CardContent>
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card>
    <Card>
    </Card>
    </>
  );
};

export default ProductCard;
