"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard, Reveal } from "@/components/site";
import { useStore } from "@/components/store";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { catalog } = useStore();
  const product = catalog.find((item) => item.slug === slug);
  if (!product) return <section className="checkout-page checkout-empty"><p className="eyebrow">Каталог</p><h1 className="page-title">Товар не найден.</h1><Link className="button button-dark" href="/shop">Вернуться в каталог</Link></section>;
  const related = catalog.filter((item) => item.category === product.category && item.id !== product.id).slice(0,4);
  if (related.length < 4) related.push(...catalog.filter((item) => item.id !== product.id && !related.includes(item)).slice(0,4-related.length));
  return <><ProductDetail product={product}/><Reveal className="section related"><div className="section-head"><h2>Похожие товары</h2></div><div className="product-grid">{related.map((item) => <ProductCard product={item} key={item.id}/>)}</div></Reveal></>;
}
