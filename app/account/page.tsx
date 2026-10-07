"use client";

import { FormEvent, useEffect, useState } from "react";
import { getAuthClient } from "@/lib/auth-client";
import { ArrowRight, Bookmark, Box, Eye, EyeOff, LogOut, Settings, UserRound } from "lucide-react";
import { money } from "@/data/products";
import { useStore } from "@/components/store";

type User = { name: string; email: string };
type Mode = "login" | "register" | "reset" | "recovery";

const benefits = [
  { icon: Bookmark, text: "Сохранённые\nкии и коллекции" },
  { icon: Box, text: "История\nзаказов" },
  { icon: Settings, text: "Личные\nнастройки" },
];

export default function AccountPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [busy, setBusy] = useState(false);
  useEffect(() => {
    // Remove the obsolete demo record, which contained an unencrypted password.
    localStorage.removeItem("vantage-cue-user");
    const auth = getAuthClient();
    if (!auth) return;
    const { data } = auth.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setMode("recovery");
      const current = session?.user;
      setUser(current ? { email: current.email || "", name: current.user_metadata.full_name || current.user_metadata.name || "Игрок" } : null);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  const saveUser = async (nextUser: User) => {
    const auth = getAuthClient();
    if (!auth) throw new Error("Сервис входа пока недоступен.");
    const { error } = await auth.auth.updateUser({ data: { full_name: nextUser.name.trim() } });
    if (error) throw new Error("Не удалось сохранить изменения. Попробуйте ещё раз.");
    setUser(nextUser);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (mode === "login") localStorage.setItem("vantage-remember", String(data.get("remember") === "on"));
    const email = String(data.get("email") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    const auth = getAuthClient();
    if (!auth) { setMessage("Сервис входа пока недоступен. Попробуйте позже."); return; }
    setBusy(true); setMessage("");
    try {
      if (mode === "register") {
        const { data: result, error } = await auth.auth.signUp({ email, password, options: { data: { full_name: String(data.get("name") || "Игрок").trim() }, emailRedirectTo: `${location.origin}/account` } });
        if (error) throw error;
        if (!result.session) setMessage("Проверьте почту: отправлена ссылка для подтверждения аккаунта.");
      } else if (mode === "reset") {
        const { error } = await auth.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/account` });
        if (error) throw error;
        setMessage("Если аккаунт существует, на почту придёт ссылка для восстановления.");
      } else if (mode === "recovery") {
        const { error } = await auth.auth.updateUser({ password });
        if (error) throw error;
        setMode("login");
      } else {
        const { error } = await auth.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch { setMessage(mode === "login" ? "Не удалось войти. Проверьте почту и пароль." : "Не удалось выполнить запрос. Попробуйте ещё раз."); }
    finally { setBusy(false); }
  };

  const googleLogin = async () => {
    const auth = getAuthClient();
    if (!auth) { setMessage("Вход через Google пока недоступен. Попробуйте позже."); return; }
    setBusy(true);
    try {
      const { error } = await auth.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/account` } });
      if (error) throw error;
    } catch { setMessage("Не удалось открыть вход через Google. Попробуйте ещё раз."); }
    finally { setBusy(false); }
  };

  if (user && mode !== "recovery") return <Profile user={user} onSave={saveUser} onLogout={async () => { const result = await getAuthClient()?.auth.signOut(); if (result?.error) throw new Error("Не удалось выйти. Попробуйте ещё раз."); setUser(null); setMode("login"); setMessage(""); }} />;

  const register = mode === "register";
  const reset = mode === "reset" || mode === "recovery";
  const title = register ? "Создать аккаунт" : reset ? "Новый пароль" : "С возвращением";
  const intro = register ? "Создайте профиль для доступа к избранному и заказам." : mode === "reset" ? "Отправим ссылку для восстановления на вашу почту." : mode === "recovery" ? "Введите новый пароль." : "Войдите, чтобы продолжить.";

  return (
    <section className="account-page">
      <AccountIntro />
      <form className="account-form" onSubmit={submit}>
        <div className="account-form-heading"><span className="eyebrow">{register ? "Новый аккаунт" : reset ? "Восстановление доступа" : "Вход в аккаунт"}</span><h2>{title}</h2><p>{intro}</p></div>
        {register && <label>Ваше имя<input required name="name" autoComplete="name" placeholder="Как к вам обращаться" /></label>}
        {mode !== "recovery" && <label>Электронная почта<input required name="email" type="email" autoComplete="email" placeholder="player@example.com" /></label>}
        {mode !== "reset" && <label className="password-field">{reset ? "Новый пароль" : "Пароль"}<input required name="password" minLength={6} autoComplete={register || reset ? "new-password" : "current-password"} type={showPassword ? "text" : "password"} placeholder="Не менее 6 символов" /><button type="button" aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></label>}
        {!register && !reset && <div className="account-form-options"><label><input name="remember" type="checkbox" defaultChecked /> <span>Запомнить меня</span></label><button type="button" onClick={() => { setMode("reset"); setMessage(""); }}>Забыли пароль?</button></div>}
        <button className="account-submit" type="submit" disabled={busy}><span>{register ? "Создать аккаунт" : mode === "reset" ? "Отправить ссылку" : reset ? "Сохранить пароль" : "Войти"}</span><ArrowRight size={22} /></button>
        {message && <p className="form-note" role="status">{message}</p>}
        {!reset && <><div className="account-divider"><span>или</span></div><button className="google-login" disabled={busy} type="button" onClick={googleLogin}><GoogleMark /><span>Продолжить через Google</span></button></>}
        <p className="account-signup">{register ? "Уже есть аккаунт?" : "Впервые в Vantage?"} <button type="button" onClick={() => { setMode(register || reset ? "login" : "register"); setMessage(""); }}>{register || reset ? "Войти" : "Создать аккаунт"}</button><ArrowRight size={16} /></p>
      </form>
    </section>
  );
}

function AccountIntro() {
  return <div className="account-intro"><div className="account-intro-copy"><p className="eyebrow">Личный кабинет</p><h1 className="page-title">Ваша игра.<br /><span>Ваш выбор.</span></h1><p className="account-lead">Избранное, заказы и настройки —<br />всё в одном месте.</p></div><ul className="account-benefits" aria-label="Преимущества личного кабинета">{benefits.map(({ icon: Icon, text }) => <li key={text}><Icon size={25} strokeWidth={1.5} /><span>{text}</span></li>)}</ul></div>;
}

function Profile({ user, onSave, onLogout }: { user: User; onSave: (user: User) => Promise<void>; onLogout: () => Promise<void> }) {
  const { orders } = useStore();
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  return <section className="profile-page"><AccountIntro /><div className="profile-panel"><div className="profile-heading"><span className="eyebrow">Ваш профиль</span><button className="profile-logout" type="button" onClick={() => { void onLogout().catch(() => setError("Не удалось выйти. Попробуйте ещё раз.")); }}>Выйти <LogOut size={17} /></button><div className="profile-avatar"><UserRound size={34} /></div><h2>{user.name}</h2><p>{user.email}</p></div><div className="profile-grid"><article><Bookmark size={22} /><b>Избранное</b><span>Сохранённые кии появятся здесь.</span></article><article><Box size={22} /><b>Заказы</b><span>{orders.length ? `Оформлено заказов: ${orders.length}` : "У вас пока нет оформленных заказов."}</span></article></div>{orders.length > 0 && <section className="order-history"><p className="eyebrow">История заказов</p>{orders.map((order) => <article key={order.id}><div><b>{order.id}</b><span>{new Intl.DateTimeFormat("ru-MD", { dateStyle: "medium" }).format(new Date(order.createdAt))} · {order.lines.length} поз.</span></div><strong>{money(order.subtotal)}</strong><small>{order.status === "new" ? "Новый заказ" : "Подтверждён"}</small></article>)}</section>}<form className="profile-edit" onSubmit={async (event) => { event.preventDefault(); setSaved(false); setError(""); try { await onSave({ ...user, name }); setSaved(true); } catch { setError("Не удалось сохранить изменения."); } }}><label>Имя<input value={name} onChange={(event) => setName(event.target.value)} /></label><button type="submit">Сохранить изменения <ArrowRight size={18} /></button>{saved && <p role="status">Изменения сохранены.</p>}{error && <p role="alert">{error}</p>}</form></div></section>;
}


function GoogleMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.36Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.97-3.38.97-2.61 0-4.82-1.76-5.61-4.13H3.05v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.39 13.92a6 6 0 0 1 0-3.84V7.49H3.05a10 10 0 0 0 0 9.02l3.34-2.59Z"/><path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.95 5.49l3.34 2.59C7.18 7.71 9.39 5.95 12 5.95Z"/></svg>;
}
