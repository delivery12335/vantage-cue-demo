import { ProductPageClient } from "@/components/product-page";
import { products } from "@/data/products";

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductPageClient slug={slug}/>;
}
