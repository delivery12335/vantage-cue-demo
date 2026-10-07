"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Box, Check, Package, ShieldCheck, Truck } from "lucide-react";
import { money } from "@/data/products";
import { DeliveryMethod, useStore } from "@/components/store";

export default function CheckoutPage() {
  const { cart, settings, placeOrder } = useStore();
  const [delivery, setDelivery] = useState<DeliveryMethod>("courier");
  const [orderId, setOrderId] = useState("");
  const subtotal = useMemo(() => cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0), [cart]);
  const shipping = delivery === "pickup" || subtotal >= settings.freeDeliveryFrom ? 0 : settings.courierFee;

  if (orderId) return <section className="checkout-page checkout-success"><Check size={44}/><p className="eyebrow">Заказ принят</p><h1 className="page-title">Спасибо за выбор.</h1><p>Заказ <b>{orderId}</b> сохранён в личном кабинете. Мы свяжемся с вами по указанному номеру, чтобы подтвердить детали.</p><div><Link className="button button-dark" href="/account">Открыть мои заказы <ArrowRight size={18}/></Link><Link className="text-link" href="/shop">Вернуться в каталог</Link></div></section>;
  if (!cart.length) return <section className="checkout-page checkout-empty"><Package size={42}/><p className="eyebrow">Оформление заказа</p><h1 className="page-title">Корзина пуста.</h1><p>Добавьте товары в корзину, и здесь появится форма оформления.</p><Link className="button button-dark" href="/shop">Открыть каталог <ArrowRight size={18}/></Link></section>;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    const order = placeOrder({ delivery, customer: { name: String(data.get("name")), email: String(data.get("email")), phone: String(data.get("phone")), address: delivery === "courier" ? String(data.get("address")) : `Самовывоз: ${settings.city}`, comment: String(data.get("comment")) } });
    setOrderId(order.id); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return <section className="checkout-page"><div className="checkout-heading"><p className="eyebrow">Оформление заказа</p><h1 className="page-title">Почти готово.</h1><p>Заполните контакты — заказ сохранится в вашем профиле.</p></div><div className="checkout-grid"><form className="checkout-form" onSubmit={submit}><fieldset><legend>Контактные данные</legend><label>Имя<input required name="name" autoComplete="name" placeholder="Ваше имя"/></label><label>Телефон<input required name="phone" type="tel" autoComplete="tel" placeholder="+373 00 000 000"/></label><label>Электронная почта<input required name="email" type="email" autoComplete="email" placeholder="player@example.com"/></label></fieldset><fieldset><legend>Способ получения</legend><label className="choice"><input type="radio" name="delivery" checked={delivery === "courier"} onChange={() => setDelivery("courier")}/><span><b>Курьерская доставка</b><small>{shipping ? `${money(shipping)} · уточним удобное время` : "Бесплатно для этого заказа"}</small></span></label><label className="choice"><input type="radio" name="delivery" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")}/><span><b>Самовывоз в {settings.city}</b><small>Бесплатно · после подтверждения заказа</small></span></label>{delivery === "courier" && <label>Адрес доставки<input required name="address" autoComplete="street-address" placeholder="Город, улица, дом, квартира"/></label>}</fieldset><label>Комментарий к заказу<textarea name="comment" rows={3} placeholder="Например, удобное время для звонка"/></label><button className="button button-dark" type="submit">Подтвердить заказ <ArrowRight size={20}/></button></form><aside className="checkout-summary"><div className="summary-heading"><h2>Ваш заказ</h2><span>Изменить</span></div>{cart.map((line, i) => <div key={`${line.product.id}-${i}`}><span>{line.product.name} × {line.quantity}</span><b>{money(line.product.price * line.quantity)}</b></div>)}<div className="checkout-total"><span>Товары</span><b>{money(subtotal)}</b><span>Доставка</span><b>{shipping ? money(shipping) : "Бесплатно"}</b><strong>Итого <em>{money(subtotal + shipping)}</em></strong></div><div className="summary-benefits"><span><ShieldCheck/><i>Гарантия<br/>качества</i></span><span><Box/><i>Надёжная<br/>упаковка</i></span><span><Truck/><i>Доставка<br/>по всему миру</i></span></div></aside></div></section>;
}
