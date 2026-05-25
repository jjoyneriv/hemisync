import ProductPageTemplate from "./ProductPageTemplate";
import { products } from "../data/products";

export default function AllProducts() {
  return (
    <>
      {products.map((product, i) => (
        <ProductPageTemplate key={product.id} product={product} altBg={i % 2 === 1} />
      ))}
    </>
  );
}
