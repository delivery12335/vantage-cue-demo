"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Instagram, Menu, Minus, Plus, Search, Send, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { money, ru } from "@/data/products";
import { Product } from "@/lib/types";
import { useStore } from "./store";

const nav = [
  ["Кии", "/shop"], ["Коллекции", "/#collections"], ["Авторские", "/shop?category=Custom+Cues"],
  ["Аксессуары", "/shop?category=Accessories"],
];

export function Header() {
  const { cart, setCartOpen, setSearchOpen } = useStore();
  const [menu, setMenu] = useState(false);
  const reduced = useReducedMotion();
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  return <>
    <motion.header className="site-header" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .36, ease: [0.22, 0.61, 0.36, 1] }}>
      <Link href="/" className="logo"><span>V</span> VANTAGE CUE</Link>
      <nav className="desktop-nav" aria-label="Основная навигация">{nav.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      <div className="header-actions">
        <button onClick={() => setSearchOpen(true)} aria-label="Поиск"><Search size={18}/><span>Поиск</span></button>
        <Link className="account-link" href="/account"><User size={18}/><span>Профиль</span></Link>
        <button onClick={() => setCartOpen(true)} aria-label={`Товаров в корзине: ${count}`}><ShoppingBag size={18}/><span>Корзина</span>{count > 0 && <b>{count}</b>}</button>
        <button className="menu-button" onClick={() => setMenu(true)} aria-label="Открыть меню"><Menu size={21}/></button>
      </div>
    </motion.header>
    <AnimatePresence>{menu && <motion.div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Мобильная навигация" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: .25 }}>
      <button className="drawer-close" onClick={() => setMenu(false)} aria-label="Закрыть меню"><X/></button>
      <nav>{nav.map(([label, href]) => <Link key={label} onClick={() => setMenu(false)} href={href}>{label}<ArrowRight size={20}/></Link>)}<Link onClick={() => setMenu(false)} href="/account">Профиль<ArrowRight size={20}/></Link></nav>
    </motion.div>}</AnimatePresence>
  </>;
}

export function ProductVisual({ product, detail = false }: { product: Product; detail?: boolean }) {
  const image = product.images[0];
  const standalone = product.slug === "studio-tip-set"
    ? "/images/studio-tip-set.png"
    : product.slug === "reach-extension"
      ? "/images/reach-extension.png"
      : null;
  const source = standalone ?? (image.sheet === "light" ? "/images/cues-light.png" : image.sheet === "dark" ? "/images/cues-dark.png" : "/images/accessories.png");
  return <div className={`product-visual ${product.category.endsWith("Cues") ? "product-visual-cue" : ""} ${product.slug === "reach-extension" ? "product-visual-extension" : ""} ${detail ? "product-visual-detail" : ""}`} role="img" aria-label={`${product.name}, ${product.shortDescription}`}>
    <div className={`product-slice ${standalone ? "product-photo" : ""}`} style={{ backgroundImage: `url(${source})`, backgroundPosition: standalone ? "center" : `${image.position * 20}% center` }}/>
  </div>;
}

export function ProductCard({ product, headingLevel = 3 }: { product: Product; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return <div className="product-card-motion"><Link href={`/product/${product.slug}`} className="product-card">
    <ProductVisual product={product}/>
    <div className="product-card-copy"><div><Heading>{product.name}</Heading><p>{product.shortDescription}</p></div><div className="product-card-price"><p>{money(product.price)}</p><span className="view-cue" aria-hidden="true"><ArrowRight size={19}/></span></div></div>
  </Link></div>;
}

type RevealTone = "up" | "soft" | "mask" | "static";
export function Reveal({ children, className = "", tone = "up" }: { children: React.ReactNode; className?: string; tone?: RevealTone }) {
  const reduced = useReducedMotion();
  const initial = tone === "mask" ? { opacity: 0, clipPath: "inset(0 8% 0 0)" } : tone === "soft" ? { opacity: 0 } : { opacity: 0, y: 14 };
  const visible = tone === "mask" ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : tone === "soft" ? { opacity: 1 } : { opacity: 1, y: 0 };
  return <motion.div className={className} initial={reduced || tone === "static" ? false : initial} whileInView={tone === "static" ? undefined : visible} viewport={{ once: true, margin: "-60px" }} transition={{ duration: tone === "mask" ? .62 : .52, ease: [0.22, 0.61, 0.36, 1] }}>{children}</motion.div>;
}

export function Overlays() { return <><SearchOverlay/><CartDrawer/></>; }

function SearchOverlay() {
  const { searchOpen, setSearchOpen, catalog } = useStore();
  const [query, setQuery] = useState("");
  const close = () => { setQuery(""); setSearchOpen(false); };
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? catalog.filter((p) => [p.name, p.category, p.material, p.collection, ru(p.category), ru(p.material), ru(p.shaft)].some((v) => v.toLowerCase().includes(q))).slice(0, 6) : catalog.filter((p) => p.featured).slice(0, 4);
  }, [query, catalog]);
  return <AnimatePresence>{searchOpen && <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && close()}>
    <motion.section className="search-panel" role="dialog" aria-modal="true" aria-label="Поиск товаров" initial={{ y: -12 }} animate={{ y: 0 }} exit={{ y: -12 }} transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}>
      <div className="search-top"><Search/><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по модели, материалу или коллекции" aria-label="Поиск товаров"/><button onClick={close} aria-label="Закрыть поиск"><X/></button></div>
      <div className="search-heading"><span>{query ? "Результаты" : "Рекомендуем"}</span><span>Найдено: {results.length}</span></div>
      {results.length ? <div className="search-results">{results.map((p) => <Link onClick={close} href={`/product/${p.slug}`} key={p.id}><ProductVisual product={p}/><span><b>{p.name}</b><small>{p.shortDescription}</small></span><em>{money(p.price)}</em></Link>)}</div> : <div className="empty-search"><p>По запросу «{query}» ничего не найдено.</p><span>Попробуйте найти клён, эбен или карбон.</span></div>}
    </motion.section>
  </motion.div>}</AnimatePresence>;
}

function CartDrawer() {
  const { cart, cartOpen, setCartOpen, quantity, remove } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (!cartOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [cartOpen]);
  const subtotal = cart.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  return <AnimatePresence>{cartOpen && <motion.div className="overlay drawer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && setCartOpen(false)}>
    <motion.aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Корзина" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }}>
      <div className="drawer-head"><div><span>Ваш выбор</span><h2>Корзина <span className="cart-count"><i aria-hidden="true">·</i><sup>{cart.length}</sup></span></h2></div><button className="drawer-close" onClick={() => setCartOpen(false)} aria-label="Закрыть корзину"><X/></button></div>
      <div className="cart-lines">{cart.length ? cart.map((line, index) => <article className="cart-line" key={`${line.product.id}-${index}`}><ProductVisual product={line.product}/><div><Link href={`/product/${line.product.slug}`} onClick={() => setCartOpen(false)}>{line.product.name}</Link>{line.product.category.endsWith("Cues") && <small>{[line.weight, line.shaft, line.tip].filter((value) => value && value !== "—").map(ru).join(" · ")}</small>}<p>{money(line.product.price)}</p><div className="line-actions"><span><button onClick={() => quantity(index, -1)} aria-label="Уменьшить количество"><Minus/></button>{line.quantity}<button onClick={() => quantity(index, 1)} aria-label="Увеличить количество"><Plus/></button></span><button onClick={() => remove(index)}>Удалить</button></div></div></article>) : <div className="empty-cart"><ShoppingBag/><h3>Корзина пока пуста.</h3><p>Добавьте кий — здесь появятся товар и выбранные настройки.</p><Link href="/shop" onClick={() => setCartOpen(false)}>Выбрать кий <ArrowRight size={16}/></Link></div>}</div>
      {cart.length > 0 && <div className="cart-summary"><div><span>Итого</span><strong>{money(subtotal)}</strong></div><button onClick={() => { setCartOpen(false); router.push("/checkout"); }}>Оформить заказ <ArrowRight/></button><small>Доставка рассчитывается при оформлении.</small></div>}
    </motion.aside>
  </motion.div>}</AnimatePresence>;
}

export function Footer() { const { settings } = useStore(); return <footer>
  <div className="footer-main">
    <div className="footer-brand"><Link href="/" className="logo logo-light"><span>V</span> VANTAGE CUE</Link><p>Точное оборудование для игроков, которые замечают каждую деталь.</p><div className="footer-social-icons">{settings.instagram && <a href={settings.instagram} aria-label="Instagram"><Instagram/></a>}{settings.telegram && <a href={settings.telegram} aria-label="Telegram"><Send/></a>}</div><div className="footer-groups"><FooterGroup title="Магазин" links={[["Кии","/shop"],["Коллекции","/#collections"],["Авторские","/shop?category=Custom+Cues"],["Аксессуары","/shop?category=Accessories"]]}/><div className="footer-group footer-information"><p>Информация</p><div className="footer-info-links"><Link href="/legal">Условия</Link><span>· Доставка</span><span>· Возврат</span></div></div><FooterGroup title="Контакты" links={[[settings.phone,`tel:${settings.phone.replace(/\s/g, "")}`],[settings.email,`mailto:${settings.email}`]]}/></div></div>
  </div>
  <div className="footer-bottom"><span>© 2026 Vantage Cue. Демонстрационный магазин.</span><div className="footer-payments"><b>VISA</b><b className="mastercard"><i/><i/></b><b>Apple Pay</b></div><span>Кишинёв · Доставка по всему миру</span></div>
</footer>; }
function FooterGroup({ title, links }: { title: string; links: string[][] }) { return <div className="footer-group"><p>{title}</p>{links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>; }
