# Настройка авторизации Vantage Cue

Код использует Supabase Auth: email/пароль, подтверждение email, Google OAuth (PKCE), восстановление через письмо, сохранение имени и выход.
Без проекта Supabase реальный вход недоступен. Локальная имитация входа и хранение паролей удалены.

1. Создайте проект Supabase или используйте существующий.
2. Скопируйте `.env.example` в `.env.local`. Укажите URL проекта и публичный publishable key. Не используйте service_role или secret key в NEXT_PUBLIC переменных.
3. В Authentication → URL Configuration задайте Site URL `http://localhost:3000` и разрешите redirect URL `http://localhost:3000/account`. При публикации добавьте адрес сайта.
4. В Authentication → Providers → Google включите Google. Добавьте Client ID и Client Secret из Google Cloud Console именно в Supabase, не в браузерный код.
5. В Google OAuth Web client задайте разрешённый callback `https://PROJECT_REF.supabase.co/auth/v1/callback` (точный URL показывает Supabase). В тестовом режиме добавьте тестовых пользователей.
6. Для писем подтверждения и восстановления настройте SMTP перед публичным запуском.
7. Пересоберите приложение: `npm run build`, затем перезапустите `npm start`.

Проверка после настройки: регистрация → письмо → подтверждение → выход → вход; Google → возврат в профиль; забыли пароль → письмо → новый пароль; обновление имени → перезагрузка → сохранённое имя.

Профиль пока показывает пустые разделы заказов и избранного. Их синхронизация с сервером отдельно не реализована.
