export type Category = "Playing Cues" | "Break Cues" | "Jump Cues" | "Custom Cues" | "Cue Cases" | "Accessories";

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: Category;
  shortDescription: string;
  description: string;
  price: number;
  images: { sheet: "light" | "dark" | "accessories"; position: number; caption?: string; detail?: boolean }[];
  material: string;
  shaft: string;
  tipDiameter: string;
  weight: string;
  length: string;
  joint: string;
  tip: string;
  stock: number;
  collection: string;
  featured?: boolean;
  limited?: string;
  new?: boolean;
};

export type CartLine = { product: Product; quantity: number; weight: string; shaft: string; tip: string };
