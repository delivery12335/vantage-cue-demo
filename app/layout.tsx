import type { Metadata } from "next";
import { Manrope, Oswald } from "next/font/google";
import "./globals.css";
import { Footer, Header, Overlays } from "@/components/site";
import { StoreProvider } from "@/components/store";

const display = Oswald({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Vantage Cue — Премиальные бильярдные кии", template: "%s — Vantage Cue" },
  description: "Каталог премиальных бильярдных киев и тщательно подобранных аксессуаров.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body className={`${display.variable} ${body.variable}`}><StoreProvider><Header/><main>{children}</main><Footer/><Overlays/></StoreProvider></body></html>;
}
