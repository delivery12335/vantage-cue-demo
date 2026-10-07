"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { money, ru } from "@/data/products";
import { useStore } from "./store";

export function ProductDetail({ product }: { product: Product }) {
  const cue = product.category !== "Accessories" && product.category !== "Cue Cases";
  const [weight, setWeight] = useState(product.weight === "9 oz" ? "9 oz" : "19 oz");
  const [shaft, setShaft] = useState(product.tipDiameter);
  const [tip, setTip] = useState(product.tip);
  const { add } = useStore();
  const configurationMultiplier = !cue ? 1
    : (weight === "18 oz" ? .98 : weight === "20 oz" ? 1.03 : 1)
      * (shaft === "11.8 mm" ? 1.05 : shaft === "12.9 mm" ? 1.025 : 1)
      * (tip === "Soft" ? .985 : 1);
  const configuredPrice = Math.round(product.price * configurationMultiplier);
  return <>
    <section className="product-page">
      <div className="product-gallery">
        <div className="product-gallery-stage" aria-live="polite">
          <GalleryImage product={product} imageIndex={0}/>
        </div>
        <div className="gallery-description"><p className="eyebrow">Описание</p><p>{product.description}</p></div>
      </div>
      <div className="product-info"><p className="eyebrow">Коллекция {ru(product.collection)}</p><h1>{product.name}</h1><p className="product-sub">{product.shortDescription}</p><strong className="product-price" key={configuredPrice}>{money(configuredPrice)}</strong>
        {product.limited && <div className="crafted-as"><span>Выпуск</span><b>{product.limited}</b></div>}
        {cue && <div className="options"><Option label="Вес" values={product.weight === "9 oz" ? ["9 oz"] : ["18 oz","19 oz","20 oz"]} value={weight} set={setWeight}/><Option label="Шафт" values={product.shaft === "Carbon" ? ["11.8 mm","12.4 mm"] : ["11.8 mm","12.4 mm","12.9 mm"]} value={shaft} set={setShaft}/><Option label="Наклейка" values={[product.tip, product.tip === "Medium" ? "Soft" : "Medium"]} value={tip} set={setTip}/></div>}
        <button className="add-cart" disabled={product.stock === 0} onClick={() => add({...product, price:configuredPrice},{weight,shaft,tip})}><span>Добавить в корзину</span><span>{money(configuredPrice)} <ArrowRight size={18}/></span></button>
        <p className="stock"><Check size={14}/> В наличии · Отправка за 2–4 рабочих дня</p>
        <div className="product-accordions">
          <details><summary>Материалы <span>+</span></summary><p>{ru(product.material)}. Рисунок натуральной древесины может немного отличаться от изображения.</p></details>
          <details><summary>Характеристики <span>+</span></summary><dl><div><dt>Тип</dt><dd>{ru(product.category)}</dd></div><div><dt>Шафт</dt><dd>{ru(product.shaft)}</dd></div><div><dt>Диаметр наклейки</dt><dd>{ru(product.tipDiameter)}</dd></div><div><dt>Соединение</dt><dd>{ru(product.joint)}</dd></div><div><dt>Длина</dt><dd>{ru(product.length)}</dd></div></dl></details>
          <details><summary>Доставка и возврат <span>+</span></summary><p>Бесплатная отслеживаемая доставка заказов от 5 200 MDL. Возврат неиспользованного товара — в течение 30 дней.</p></details>
        </div>
        <div className="mobile-detail-photo" role="img" aria-label="Материал и соединение кия"/>
      </div>
    </section>
  </>;
}

function GalleryImage({ product, imageIndex, thumbnail = false }: { product:Product; imageIndex:number; thumbnail?:boolean }) {
  const image = product.images[imageIndex];
  const standalone = imageIndex === 0 && (product.slug === "studio-tip-set" || product.slug === "reach-extension");
  const source = standalone
    ? product.slug === "studio-tip-set" ? "/images/studio-tip-set.png" : "/images/reach-extension.png"
    : image.sheet === "light" ? "/images/cues-light.png" : image.sheet === "dark" ? "/images/cues-dark.png" : "/images/accessories.png";
  return <div className={`gallery-media ${product.category.endsWith("Cues") ? "gallery-media-cue" : ""} ${standalone ? "gallery-media-standalone" : ""} ${image.detail ? "gallery-media-detail" : ""} ${thumbnail ? "gallery-media-thumbnail" : ""}`} role="img" aria-label={`${product.name}, ${image.caption ?? `фото ${imageIndex + 1}`} `}>
    <div className="gallery-media-source" style={{ backgroundImage:`url(${source})`, backgroundPosition:standalone ? "center" : `${image.position * 20}% center` }}/>
  </div>;
}

function Option({ label, values, value, set }: { label:string; values:string[]; value:string; set:(v:string)=>void }) { return <fieldset><legend>{label} <span>{ru(value)}</span></legend><div>{values.map((v) => <button type="button" className={value===v?"active":""} onClick={() => set(v)} key={v}>{ru(v)}</button>)}</div></fieldset>; }
