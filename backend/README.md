# BONE BOUILLON — backend (FastAPI)

API + admin + Telegram order bot for the BONE BOUILLON storefront.

## Стек
FastAPI · SQLAlchemy 2 · Pydantic v2 · PostgreSQL (SQLite fallback в dev) · Alembic · httpx.

## Локальный запуск

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env            # заполнить BOT_TOKEN, ADMIN_*, при необходимости DATABASE_URL
alembic upgrade head            # применить миграции (без DATABASE_URL → SQLite dev.db)
python -m app.seed              # посев каталога + админ + слоты
uvicorn app.main:app --reload --port 5039
```

Тесты: `pytest` (использует in-memory SQLite, сеть не нужна).

## Переменные окружения
См. `.env.example`. Ключевые: `DATABASE_URL` (Postgres в проде), `BOT_TOKEN` + `TELEGRAM_CHAT_ID` (уведомления о заказах), `TELEGRAM_PROXIES` (прокси/VPN для доступа к Telegram из РФ — список, ротация с залипанием на рабочем), `ADMIN_USERNAME`/`ADMIN_PASSWORD`, `CORS_ORIGINS` (домен фронта), `MEDIA_DIR`.

## API (кратко)
- Публичные: `GET /api/categories`, `GET /api/products?category=&q=`, `GET /api/products/{slug}`, `GET /api/delivery/slots`, `POST /api/orders`.
- Админ (Bearer-токен): `POST /api/admin/login|logout`, `GET /api/admin/me`, CRUD `/api/admin/categories|products` (+ `POST /api/admin/products/{id}/images`), `/api/admin/orders` (+ `PATCH .../status`), `/api/admin/slots` (+ `/generate`), `/api/admin/settings`.
- Медиа: загруженные фото отдаются на `/media/...`.

## Деплой (Railway / Render)
1. Managed **PostgreSQL** → `DATABASE_URL` в переменные.
2. Сервис из `backend/`: старт `alembic upgrade head && python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. **Постоянный том** на `MEDIA_DIR` (иначе загруженные фото пропадут при редеплое).
4. Секреты: `BOT_TOKEN`, `ADMIN_PASSWORD`, `TELEGRAM_PROXIES` — только в переменных окружения.
5. `CORS_ORIGINS` = домен фронта на Vercel.
6. Во фронте (Vercel) задать `VITE_API_URL` = origin бэкенда и пересобрать.

## Telegram
Уведомления шлются исходящими вызовами Bot API через прокси-пул (`app/proxy.py`): список из `TELEGRAM_PROXIES` (или админ-настройки `telegram_proxies`) пробуется по очереди, залипает на рабочем, при сбое ротирует, direct — последним. Формат записи — proxy URL; голый `host:port` трактуется как `socks5://host:port` (локальный VPN-порт). Отправка fail-safe: заказ сохраняется даже при недоступности Telegram (`tg_delivered=false`).
