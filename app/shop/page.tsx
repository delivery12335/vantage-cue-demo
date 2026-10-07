"use client";

import { Suspense, useId, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { ru } from "@/data/products";
import { ProductCard } from "@/components/site";
import { useStore } from "@/components/store";

const ranges = ["All prices", "Under $300", "$300–600", "$600–1000", "$1000+"];
const weights = ["All weights", "Under 10 oz", "18–20 oz"];
const optionLabels: Record<string,string> = {
  "All products":"Все товары", "All prices":"Все цены", "Under $300":"До 5 200 MDL",
  "$300–600":"5 200–10 400 MDL", "$600–1000":"10 400–17 300 MDL", "$1000+":"От 17 300 MDL",
  "All materials":"Все материалы", "All shafts":"Все шафты", "All weights":"Любой вес",
  "Under 10 oz":"До 0,283 кг", "18–20 oz":"0,510–0,567 кг", "Featured":"Рекомендуемые",
  "Newest":"Сначала новые", "Price: Low to High":"Сначала дешевле", "Price: High to Low":"Сначала дороже",
};
const optionLabel = (value:string) => optionLabels[value] ?? ru(value);

export default function ShopPage() { return <Suspense><Shop/></Suspense>; }

function Shop() {
  const params = useSearchParams();
  const categoryParam = params.get("category");
  return <ShopContent key={categoryParam ?? "all"} categoryParam={categoryParam}/>;
}

function ShopContent({ categoryParam }: { categoryParam: string | null }) {
  const { catalog } = useStore();
  const [category, setCategory] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [price, setPrice] = useState<string[]>([]);
  const [material, setMaterial] = useState<string[]>([]);
  const [shaft, setShaft] = useState<string[]>([]);
  const [weight, setWeight] = useState<string[]>([]);
  const [sort, setSort] = useState("Featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const materials = ["All materials", ...Array.from(new Set(catalog.map((p) => p.material)))];
  const shafts = ["All shafts", ...Array.from(new Set(catalog.map((p) => p.shaft).filter((v) => v !== "—")))];
  const categories = ["All products", ...Array.from(new Set(catalog.map((p) => p.category)))];
  const quickCategories = [
    { label: "Игровые кии", value: "Playing Cues" },
    { label: "Авторские модели", value: "Custom Cues" },
    { label: "Аксессуары", value: "Accessories" },
  ];
  const result = useMemo(() => catalog.filter((p) => {
    const matchPrice = !price.length || price.some((range) => (range === "Under $300" && p.price < 300) || (range === "$300–600" && p.price >= 300 && p.price <= 600) || (range === "$600–1000" && p.price > 600 && p.price <= 1000) || (range === "$1000+" && p.price > 1000));
    const matchWeight = !weight.length || weight.some((range) => (range === "Under 10 oz" && p.weight === "9 oz") || (range === "18–20 oz" && p.weight === "18–20 oz"));
    return (!category.length || category.includes(p.category)) && matchPrice && (!material.length || material.includes(p.material)) && (!shaft.length || shaft.includes(p.shaft)) && matchWeight;
  }).sort((a,b) => sort === "Price: Low to High" ? a.price-b.price : sort === "Price: High to Low" ? b.price-a.price : sort === "Newest" ? Number(b.new)-Number(a.new) || b.id-a.id : Number(b.featured)-Number(a.featured)), [catalog,category,price,material,shaft,weight,sort]);
  const clear = () => { setCategory([]); setPrice([]); setMaterial([]); setShaft([]); setWeight([]); };
  const controls = <div className="filter-list"><Select label="Категория" value={category} values={categories} onChange={setCategory}/><Select label="Цена" value={price} values={ranges} onChange={setPrice}/><Select label="Материал" value={material} values={materials} onChange={setMaterial}/><Select label="Шафт" value={shaft} values={shafts} onChange={setShaft}/><Select label="Вес" value={weight} values={weights} onChange={setWeight}/><button className="clear-filters" onClick={clear}>Сбросить фильтры</button></div>;
  return <div className="shop-reference">
    <section className="shop-hero">
      <div className="shop-hero-image" aria-hidden="true" />
      <div className="shop-hero-copy">
        <p className="eyebrow">Полная коллекция</p>
        <h1 className="page-title">Все товары</h1>
        <p className="shop-hero-description">От сбалансированных игровых киев до аксессуаров —<br />всё для точности, контроля и уверенной игры.</p>
        <div className="shop-quick-categories" aria-label="Быстрый выбор категории">
          {quickCategories.map(({ label, value }) => <button type="button" aria-pressed={category.includes(value)} className={category.includes(value) ? "active" : ""} key={value} onClick={() => setCategory(category.includes(value) ? category.filter((v) => v !== value) : [...category, value])}>{label}</button>)}
        </div>
      </div>
      <div className="shop-hero-meta"><span>{result.length} товаров</span><Select label="Сортировка" value={sort} values={["Featured", "Newest", "Price: Low to High", "Price: High to Low"]} onChange={setSort} compact /></div>
    </section>
    <section className="catalog">
      <aside className="catalog-sidebar"><p>Фильтры</p>{controls}</aside>
      <div className="catalog-main"><div className="catalog-toolbar"><button className="mobile-filter" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={17}/> Фильтры</button><span>Показано товаров: {result.length}</span><Select label="Сортировка" value={sort} values={["Featured","Newest","Price: Low to High","Price: High to Low"]} onChange={setSort} compact/></div>
        {result.length ? <div className="catalog-grid">{result.map((p) => <ProductCard product={p} headingLevel={2} key={p.id}/>)}</div> : <div className="catalog-empty"><h2>Товары не найдены.</h2><p>Измените один из фильтров или вернитесь к полному каталогу.</p><button className="button button-dark" onClick={clear}>Сбросить фильтры</button></div>}
      </div>
    </section>
    {filtersOpen && <div className="mobile-filters" role="dialog" aria-modal="true" aria-label="Фильтры каталога"><div className="drawer-head"><div><span>Каталог</span><h2>Фильтры</h2></div><button className="drawer-close" aria-label="Закрыть фильтры" onClick={() => setFiltersOpen(false)}><X/></button></div>{controls}<button className="apply-filters" onClick={() => setFiltersOpen(false)}>Показать: {result.length}</button></div>}
  </div>;
}

type SelectProps = { label:string; values:string[] } & ({ compact:true; value:string; onChange:(v:string)=>void } | { compact?:false; value:string[]; onChange:(v:string[])=>void });
function Select(props: SelectProps) {
  const { label, values } = props;
  const [open, setOpen] = useState(false);
  const id = useId();
  if (props.compact) return <label className="select-wrap compact"><span>{label}</span><div><select aria-label={label} value={props.value} onChange={(e) => props.onChange(e.target.value)}>{values.map((v) => <option value={v} key={v}>{optionLabel(v)}</option>)}</select><ChevronDown size={14}/></div></label>;
  const { value, onChange } = props;
  return <div className={`filter-dropdown ${open ? "is-open" : ""}`}>
    <button className="filter-dropdown-trigger" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      <span>{label}</span><ChevronDown size={15}/><strong>{value.length ? value.map(optionLabel).join(", ") : optionLabel(values[0])}</strong>
    </button>
    <div className="filter-dropdown-panel" id={id} inert={!open} onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); event.currentTarget.parentElement?.querySelector<HTMLButtonElement>("button")?.focus(); } }}>
      <div><div className="filter-dropdown-options" role="group" aria-label={label}>
        {values.map((v, index) => {
          const selected = index === 0 ? value.length === 0 : value.includes(v);
          return <button type="button" key={v} aria-pressed={selected} className={selected ? "selected" : ""} onClick={() => onChange(index === 0 ? [] : selected ? value.filter((item) => item !== v) : [...value, v])}><span className="filter-choice-dot" aria-hidden="true"/>{optionLabel(v)}</button>;
        })}
      </div></div>
    </div>
  </div>;
}
