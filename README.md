# Образ — персональный AI-ассистент по внешности и здоровью (MVP)

Holistic-приложение вокруг единого **«профиля себя»** (цветотип, фигура, кожа/волосы,
цели, бюджет, lifestyle). Три модуля + надстройка **Style DNA**, которая **всегда
объясняет причину** рекомендации.

- 👕 **Гардероб и стиль** — цифровой шкаф, аналитика (cost-per-wear, пробелы), мок-примерка.
- ✨ **Бьюти** — дневник кожи/волос, трекер средств, мок-анализ кожи, AI-консультант.
- 🏃 **Фитнес** — цели, трекер активности, AI-подбор упражнений.
- 🧬 **Style DNA** — карта внешности (Style/Beauty/Body DNA) + `PurchaseImpactScore` с прозрачными формулами.

> Ключевая фича: AI не говорит «надень рубашку» — он объясняет «этот образ расширяет
> плечи и выглядит дороже за счёт спокойной палитры; докупить лучше ботинки — они
> усилят ~70% образов».

## Стек

| Слой | Технологии |
|------|-----------|
| Frontend | React + Vite + TypeScript, Tailwind, **PWA** (офлайн), Zustand, TanStack Query |
| Backend | Node + **Hono**, Zod-валидация |
| БД/Auth/Storage | **Supabase** (self-hosted) + **Prisma** (Postgres) |
| Общий код | `@obraz/shared` — типы, i18n (ru), константы, формулы скоринга (Vitest) |

Монорепо на npm workspaces:

```
packages/shared/   # типы, i18n, константы, PersonalRecommendationEngine (+тесты)
apps/api/          # Hono + Prisma-схема + слой провайдеров
apps/web/          # PWA-клиент (мобильный-первый)
```

## Защита от санкций: слой провайдеров

Все «тяжёлые» внешние возможности — за единым интерфейсом, реализацию можно
подменить, не трогая остальной код. Вызовы идут **только через бэкенд** (прокси),
ключи живут в env на сервере и **никогда** не попадают в клиент.

| Провайдер | По умолчанию | Заготовка под вендора (v2) |
|-----------|--------------|----------------------------|
| `AIProvider` | `MockAIProvider` (или Claude, если есть `ANTHROPIC_API_KEY`) | Anthropic Claude (Sonnet) |
| `SkinAnalysisProvider` | `MockSkinAnalysisProvider` | Perfect Corp (TODO) |
| `TryOnProvider` | `MockTryOnProvider` | Aiuta / FASHN (TODO) |
| `MarketplaceProvider` | мок-каталог | Wildberries / Ozon / Lamoda (TODO) |

## Запуск локально

```bash
npm install
cp .env.example .env          # ключи не обязательны: без них AI работает в мок-режиме

# терминал 1 — бэкенд (http://localhost:8787)
npm run dev:api

# терминал 2 — фронт (http://localhost:5173)
npm run dev:web
```

Проверки:

```bash
npm run typecheck   # типы во всех воркспейсах
npm run test        # Vitest (формулы скоринга)
npm run build       # сборка, включая PWA
```

### AI на Claude (опционально)

В `.env` задай `ANTHROPIC_API_KEY` — бэкенд сам переключится на Claude
(`AIProvider = anthropic`). Ключ читается только на сервере (`apps/api`).

### База данных (Supabase/Postgres)

Схема готова в `apps/api/prisma/schema.prisma`. На старте приложение **локально-первое**
(данные в браузере, PWA-офлайн). Для живой БД: подними self-hosted Supabase, задай
`DATABASE_URL`, выполни `npm run prisma:migrate -w apps/api`.

## API

| Метод | Путь | Назначение |
|-------|------|-----------|
| GET | `/api/health` | статус + активные провайдеры |
| POST | `/api/ai/chat` | AI-стайлинг (прокси к Claude/моку) |
| POST | `/api/skin/analyze` | анализ кожи (мок) |
| POST | `/api/tryon` | виртуальная примерка (мок) |
| GET | `/api/marketplace/search` | поиск товаров (мок) |
| POST | `/api/recommendations/score` | `PurchaseImpactScore` |

## Безопасность и дисклеймеры

- Ключей в клиенте/коммитах нет — только env на бэкенде.
- Бьюти/тело — **не медицинская диагностика**. Дисклеймеры показаны везде; при
  серьёзных проблемах приложение советует обратиться к врачу.
- Весь пользовательский ввод валидируется (Zod на бэке, формы на фронте).

Подробный PRD и план фаз — в [`docs/PRD.md`](docs/PRD.md).
