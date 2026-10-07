"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cues, products } from "@/data/products";
import { ProductCard, Reveal } from "@/components/site";

export default function Home() {
  const reduced = useReducedMotion();
  return <>
    <section className="hero">
      <motion.div className="hero-image" initial={reduced ? false : { opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.45, ease: [0.22, 0.61, 0.36, 1] }}/>
      <div className="hero-copy">
        <motion.p className="eyebrow" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .46, ease: [0.22, 0.61, 0.36, 1] }}>Точность в каждом ударе</motion.p>
        <motion.h1 initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16, duration: .58, ease: [0.22, 0.61, 0.36, 1] }}>Игра <span>начинается<br/>здесь.</span></motion.h1>
      </div>
      <motion.div className="hero-bottom" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .26, duration: .52, ease: [0.22, 0.61, 0.36, 1] }}><p>Когда важен не только удар, но и ощущение от него.</p><div className="hero-actions"><Link className="hero-collections" href="/#collections"><span>Узнать о коллекции</span> <ArrowRight size={17}/></Link><Link className="button" href="/shop">Выбрать кий <ArrowRight size={17}/></Link></div></motion.div>
    </section>

    <Reveal className="section" tone="static">
      <div className="section-head"><h2>Избранные кии</h2><Link className="featured-all-link" href="/shop">Все кии: {cues.length} <ArrowRight size={20}/></Link></div>
      <div className="product-grid">{products.filter((p) => p.featured).map((p) => <ProductCard product={p} key={p.id}/>)}</div>
    </Reveal>

    <Reveal className="section collections" tone="static">
      <div className="section-head"><h2>Коллекции</h2><span className="eyebrow">Четыре стиля игры</span></div>
      <div className="collection-grid" id="collections">
        <Collection title="Игровые" count="9 киев" href="/shop?category=Playing+Cues" image="/images/hero.png" position="center"/>
        <Collection title="Для разбоя" count="1 кий" href="/shop?category=Break+Cues" image="/images/cues-dark.png" position="36% center"/>
        <Collection title="Авторские" count="2 кия" href="/shop?category=Custom+Cues" image="/images/cues-light.png" position="100% center"/>
        <Collection title="Лимитированные" count="2 серии" href="/product/atelier-c6" image="/images/hero.png" position="78% center"/>
      </div>
    </Reveal>

    <Reveal className="craft" tone="soft">
      <div className="craft-image" role="img" aria-label="Детали соединений и шафтов кия"/>
      <div className="craft-copy"><p className="eyebrow">Продуманная конструкция</p><h2>Чувство<br/><span>точности.</span></h2><p>Точность, баланс и мастерство в каждой детали — заметные там, где это действительно важно.</p><div className="principles">
        <Principle number="01" title="Материал" text="Древесина отбирается по стабильности, рисунку и тактильной отдаче." index={0}/>
        <Principle number="02" title="Баланс" text="Выверенный центр тяжести для спокойного и повторяемого удара." index={1}/>
        <Principle number="03" title="Покрытие" text="Тонкая защита сохраняет естественный характер древесины." index={2}/>
      </div></div>
    </Reveal>

  </>;
}

function Collection({ title, count, href, image, position }: { title:string; count:string; href:string; image:string; position:string }) {
  return <div className="collection-motion"><Link href={href} className="collection"><div className="collection-image" style={{ backgroundImage:`url(${image})`, backgroundPosition:position }} role="img" aria-label={`Коллекция «${title}»`}/><div className="collection-copy"><div><p>{count}</p><h3>{title}</h3></div><ArrowDownRight/></div></Link></div>;
}
function Principle({ number, title, text, index }: { number:string; title:string; text:string; index:number }) {
  const reduced = useReducedMotion();
  return <motion.article initial={reduced ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: index * .08, duration: .48, ease: [0.22, 0.61, 0.36, 1] }}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight aria-hidden="true"/></motion.article>;
}
