---
name: fsd-architecture
description: Use when creating new modules, refactoring folder structure, moving code between layers, or deciding where to place new code. Enforces FSD layer isolation, public API rules, and migration path from legacy modules/.
---

# FSD-архитектура

## Структура слоёв (сверху вниз)

```
pages/        — композиция страниц (роуты)
widgets/      — самостоятельные блоки (сочетают entities + features)
features/     — бизнес-фичи (пользовательские сценарии)
entities/     — доменные сущности (данные + UI карточки)
shared/       — переиспользуемый код (без бизнес-логики)
```

## Правила изоляции слоёв

**Слой может импортировать только нижележащие слои:**

| Слой | Может импортировать | Не может импортировать |
|------|---------------------|----------------------|
| `pages/` | `widgets/`, `features/`, `entities/`, `shared/` | другие pages |
| `widgets/` | `features/`, `entities/`, `shared/` | `pages/`, другие widgets |
| `features/` | `entities/`, `shared/` | `pages/`, `widgets/`, другие features |
| `entities/` | `shared/` | `pages/`, `widgets/`, `features/`, другие entities |
| `shared/` | только `shared/` | всё остальное |

**Исключения:**
- `entities/order/` может импортировать `entities/driver/` — для связи сущностей, только если эта связь объявлена явно
- `widgets/` может импортировать другой `widgets/` только если один является контейнером для другого

## Сегменты внутри сущностей (entities/)

Каждая сущность может содержать сегменты:

```
entities/order/
  ├── index.js        — Public API (реэкспорт только того, что нужно снаружи)
  ├── model/          — бизнес-логика, сторы, типы
  ├── ui/             — компоненты (если много — разбить по смыслу)
  ├── api/            — запросы к серверу для этой сущности
  └── lib/            — хелперы, форматтеры, валидаторы
```

**Правило public API:** Каждая сущность/фича/виджет ОБЯЗАНА иметь `index.js`, который реэкспортирует только то, что разрешено использовать снаружи. Другие слои импортируют ТОЛЬКО через `index.js`.

```js
// entities/order/index.js — ПРАВИЛЬНО
export { useOrderStore } from './model/orderModel'
export { default as OrderForm } from './form/orderForm.vue'

// НЕПРАВИЛЬНО — прямой импорт в обход public API
import { useOrderStore } from '@/entities/order/model/orderModel'
```

## Сегменты в shared/

```
shared/
  ├── ui/             — переиспользуемые UI-компоненты (не знают о бизнес-логике)
  ├── services/       — API-сервисы (axios-запросы)
  ├── stores/         — глобальные Pinia-сторы (layout, app)
  ├── hooks/          — переиспользуемые composables
  ├── constants/      — константы, enum-ы, справочники
  ├── utils/          — чистые утилитарные функции
  └── values/         — value objects (Price, etc.)
```

**`shared/ui/` не должен:**
- Импортировать из `entities/`, `features/`, `widgets/`, `pages/`
- Содержать доменную логику
- Использовать `@/entities/*` или `@/features/*`

## Куда помещать новый код

| Ситуация | Куда класть |
|----------|------------|
| API-запросы для сущности «заказ» | `entities/order/api/` (НЕ `shared/services/`) |
| Компонент формы заказа | `entities/order/form/` |
| Компонент кнопки «Создать заказ» с диалогом | `features/order/` |
| Таблица заказов + фильтры + пагинация | `widgets/` (новый widget) или внутри `pages/` |
| Дата-пикер с выбором периода | `shared/ui/DateInputs/` |
| Форматтер денег | `shared/utils/` |
| Константы статусов заказа | `shared/constants/` (если переиспользуется) или `entities/order/lib/` (если только внутри заказа) |
| Страница списка заказов | `pages/orders/` |

## Текущее состояние и миграция из modules/

**Сейчас проект в гибридном состоянии:**

| Легаси (`modules/`) | Куда мигрировать |
|---------------------|-------------------|
| `modules/auth/` | `features/auth/` (rotues + pages + store) |
| `modules/order/store/` | Уже есть `entities/order/model/`, удалить легаси |
| `modules/order/utils/` | `entities/order/lib/` |
| `modules/accounting/` | `features/accounting/` (salaryTariffs), `entities/` для отдельных сущностей |
| `modules/profile/` | `features/profile/` (orderTemplate) |
| `modules/common/components/` | Распределить: `shared/ui/` (appSnackbar, autocomplete, tableColumnSettings) или `entities/` (workerAutocomplete, zoneAutocomplete) |

**Приоритет миграции:**
1. `modules/common/` → `shared/ui/` (самые переиспользуемые компоненты)
2. `modules/order/` → удалить (уже дублировано в entities)
3. `modules/auth/` → `features/auth/`
4. `modules/accounting/` → `features/` + `entities/`
5. `modules/profile/` → `features/`

**shared/services/ тоже подлежит миграции:**
- Сейчас это плоские файлы в `shared/services/<entity>/<entity>.service.js`
- Нужно: перенести каждый сервис в `entities/<entity>/api/` соответствующей сущности
- После переноса оставить в `shared/services/` только кросс-доменные сервисы (`permission`, `file`, `report`, `user`)

## Проверка архитектуры при ревью

При создании/изменении кода проверять:
1. Не нарушены ли границы слоёв (импорт из вышележащего слоя)
2. Есть ли `index.js` public API у нового кода
3. Не попала ли бизнес-логика в `shared/`
4. Не дублируется ли код с `modules/` (если да — мигрировать, а не создавать новое)
5. Используется ли Pinia (а не Vuex) для новых сторов

## Частые ошибки

- **«Положу в shared/ui, потом разберусь»** → shared/ui засоряется доменными компонентами. Если компонент привязан к сущности — он в entities.
- **Прямой импорт в обход index.js** → теряется контроль над public API, рефакторинг ломает всё.
- **Стор сущности в shared/stores/** → Pinia-стор сущности должен лежать в `entities/<entity>/model/` или рядом с компонентом.
- **Копипаст из modules/ в entities/** → нужно мигрировать с рефакторингом (script setup, Pinia, defineModel), а не копировать as-is.
