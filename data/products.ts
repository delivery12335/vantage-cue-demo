import { Product } from "@/lib/types";

const translations: Record<string, string> = {
  "Playing Cues":"Игровые кии", "Break Cues":"Кии для разбоя", "Jump Cues":"Джамп-кии",
  "Custom Cues":"Авторские кии", "Cue Cases":"Чехлы для киев", "Accessories":"Аксессуары",
  "Hard Maple":"Твёрдый клён", "Maple":"Клён", "Ebony":"Эбен", "Walnut":"Орех",
  "Low Deflection":"С низким отклонением", "Carbon":"Карбон", "Carbon & Ebony":"Карбон и эбен",
  "Figured Maple":"Фигурный клён", "Cocobolo":"Кокоболо", "Smoked Ash":"Тонированный ясень",
  "Carbon Composite":"Карбоновый композит", "Stained Maple":"Окрашенный клён",
  "Olivewood":"Оливковое дерево", "Structured Leather":"Фактурная кожа",
  "Performance Chalk":"Профессиональный мел", "Technical Knit":"Технический трикотаж",
  "Layered Leather":"Многослойная кожа", "Ebony & Steel":"Эбен и сталь",
  "Coated Canvas":"Канвас с покрытием", "Medium":"Средняя", "Soft":"Мягкая", "Hard":"Жёсткая",
  "18 oz":"0,510 кг", "19 oz":"0,539 кг", "20 oz":"0,567 кг", "9 oz":"0,255 кг", "18–20 oz":"0,510–0,567 кг",
  "Radial":"Радиальное", "Essentials":"Основная серия",
};

export const ru = (value: string) => {
  if (translations[value]) return translations[value];
  if (/^\d+(?:\.\d+)? mm$/.test(value)) return `${value.replace(".", ",").replace(" mm", "")} мм`;
  if (/^\d+"$/.test(value)) return `${value.slice(0, -1)} дюйм.`;
  return value;
};

const productKind: Record<Product["category"], string> = {
  "Playing Cues":"Игровой кий", "Break Cues":"Кий для разбоя", "Jump Cues":"Джамп-кий",
  "Custom Cues":"Авторский кий", "Cue Cases":"Чехол для кия", "Accessories":"Бильярдный аксессуар",
};

const cue = (
  id: number, name: string, category: Product["category"], price: number,
  material: string, shaft: string, collection: string, sheet: "light" | "dark", position: number,
  extra: Partial<Product> = {},
): Product => ({
  id, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), name, category, price,
  shortDescription: `${ru(material)} · ${productKind[category]}`,
  description: `Сбалансированный и отзывчивый кий с предсказуемой обратной связью. ${name} сочетает материал «${ru(material).toLowerCase()}» и шафт «${ru(shaft).toLowerCase()}» для чистого удара и уверенного контроля скорости.`,
  images: [
    { sheet, position, caption: "Полный вид" },
    { sheet, position, caption: "Детали и отделка", detail: true },
  ],
  material, shaft, tipDiameter: shaft === "Carbon" ? "11.8 mm" : "12.4 mm", weight: "18–20 oz", length: '58"',
  joint: "Radial", tip: "Medium", stock: 8, collection, ...extra,
});

const accessory = (id: number, name: string, category: Product["category"], price: number, position: number, material: string): Product => ({
  id, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, category, price,
  shortDescription: `${ru(material)} · ${productKind[category]}`,
  description: "Надёжный и продуманный аксессуар для защиты оборудования и стабильной игры без лишнего объёма.",
  images: [{ sheet: "accessories", position, caption: "Общий вид" }], material, shaft: "—", tipDiameter: "—", weight: "—", length: "—", joint: "—", tip: "—", stock: 18, collection: "Essentials",
});

export const products: Product[] = [
  cue(1, "Axiom M1", "Playing Cues", 249, "Hard Maple", "Maple", "Core", "light", 0, { featured: true }),
  cue(2, "Nocturne E7", "Playing Cues", 749, "Ebony", "Low Deflection", "Nocturne", "light", 1, { featured: true }),
  cue(3, "Meridian W3", "Playing Cues", 449, "Walnut", "Low Deflection", "Meridian", "light", 2),
  cue(4, "Vector C11", "Playing Cues", 990, "Carbon & Ebony", "Carbon", "Vector", "light", 3, { featured: true }),
  cue(5, "Lumen M5", "Playing Cues", 599, "Figured Maple", "Low Deflection", "Lumen", "light", 4),
  cue(6, "Atelier C6", "Custom Cues", 1890, "Cocobolo", "Low Deflection", "Atelier", "light", 5, { featured: true, limited: "№ 11 из 50" }),
  cue(7, "Slate S2", "Playing Cues", 329, "Smoked Ash", "Maple", "Slate", "dark", 0, { new: true }),
  cue(8, "Force B9", "Break Cues", 699, "Carbon Composite", "Carbon", "Force", "dark", 1, { tipDiameter: "13.0 mm", tip: "Hard" }),
  cue(9, "Garnet R4", "Playing Cues", 549, "Stained Maple", "Low Deflection", "Garnet", "dark", 2),
  cue(10, "Ridge O8", "Playing Cues", 399, "Olivewood", "Maple", "Ridge", "dark", 3),
  cue(11, "Monolith 01", "Custom Cues", 1290, "Ebony", "Carbon", "Monolith", "dark", 4, { limited: "№ 27 из 80" }),
  cue(12, "Flux J2", "Jump Cues", 289, "Carbon Composite", "Carbon", "Flux", "dark", 5, { length: '41"', weight: "9 oz", tip: "Hard" }),
  accessory(13, "Form Case 2×4", "Cue Cases", 219, 0, "Structured Leather"),
  accessory(14, "Axis Chalk Duo", "Accessories", 24, 1, "Performance Chalk"),
  accessory(15, "Quiet Stroke Glove", "Accessories", 29, 2, "Technical Knit"),
  accessory(16, "Studio Tip Set", "Accessories", 39, 3, "Layered Leather"),
  accessory(17, "Reach Extension", "Accessories", 89, 4, "Ebony & Steel"),
  accessory(18, "Transit Case 1×2", "Cue Cases", 149, 5, "Coated Canvas"),
];

export const cues = products.filter((p) => p.category.includes("Cues") && p.category !== "Cue Cases");
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
const USD_MDL = 17.2682;
const EUR_MDL = 20.0380;
const number = new Intl.NumberFormat("ru-MD", { maximumFractionDigits:0 });
export const money = (price: number) => {
  const mdl = Math.round(price * USD_MDL / 10) * 10;
  const eur = Math.round(price * USD_MDL / EUR_MDL);
  return `${number.format(mdl)} MDL · €${number.format(eur)}`;
};
