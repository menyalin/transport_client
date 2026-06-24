---
name: docker-ci
description: Use when working with Dockerfiles, Docker build, GitHub Actions workflows, CI/CD configuration, nginx configs, or deployment-related changes. Covers production and staging builds for s4log.ru and carrier.logicore.ru.
---

# Docker & CI/CD

## Dockerfiles

- `Dockerfile` — production build для s4log.ru, собирается при PR в `main`
- `Dockerfile.alfa` — staging build для carrier.logicore.ru, собирается при PR в `alfa`

Оба собирают приложение через `npm run build` и серверят через nginx.

Не трогать Dockerfiles без явной задачи — конфигурация стабильна и проверена в CI.

## GitHub Actions

Два workflow в `.github/workflows/`:
- `buildDockerImage_prod.yml` — сборка и пуш Docker-образа при мерже в `main`
- `buildDockerImage_alfa.yml` — сборка и пуш Docker-образа при мерже в `alfa`

CI использует self-hosted runner и пушит образы в Docker Hub.

## Nginx

- `nginx.conf` — production: проксирует `/api`, `/socket.io`, `/static` на бэкенд
- `alfa.nginx.conf` — staging: то же самое для alfa-окружения

При изменении путей API или добавлении новых проксируемых маршрутов — обновлять соответствующий nginx.conf.

## Окружения

`.env` файл содержит VUE_APP_* и VITE_* переменные, все указывают на `localhost:3040`.
В продакшене URL подставляются через переменные окружения Docker-контейнера или на этапе сборки.

## Deploy

Деплой происходит автоматически через GitHub Actions после мержа PR:
- `main` → production на s4log.ru
- `alfa` → staging на carrier.logicore.ru

Ручной деплой не требуется и не рекомендуется.
