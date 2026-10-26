# API ядра и SSR

Создайте детектор вне обработчика запроса, а результат храните в контексте конкретного запроса. Middleware описана на странице [Express](/ru/integrations/express).

## API ядра с Express и Fastify

Оба фреймворка предоставляют заголовки Node.js через `request.headers`:

```ts
import { undevice } from 'undevice';

const { detect } = undevice();

// В обработчике запроса Express или Fastify:
const device = detect({ headers: request.headers });
```

Передайте флаги в ответ, шаблон или локальный контекст запроса. Не храните результат последнего запроса в общей переменной модуля.

## Astro

Для определения устройства текущего посетителя используйте серверный рендеринг:

```astro
---
import { undevice } from 'undevice';

export const prerender = false;
const { detect } = undevice();
const device = detect({ headers: Astro.request.headers });
---

<p>Мобильное устройство: {String(device.isMobile)}</p>
```

Для повторного использования экспортируйте настроенный детектор из модуля приложения. При статической генерации заголовки конкретного посетителя недоступны.

## Обработчики Fetch

```ts twoslash
import { undevice } from 'undevice';

const { detect } = undevice();

export function handleRequest(request: Request): Response {
  return Response.json(detect({ headers: request.headers }));
}
```

## Гидратация

Передайте серверный результат на клиент для первого рендера. Независимое определение на сервере и клиенте может дать разные флаги, особенно если сервер использует заголовки CDN.

::: tip Флаги устройства описывают признаки клиента
Для адаптивной вёрстки используйте CSS media queries. Флаги полезны, когда логика приложения зависит от устройства. User-Agent передаётся клиентом и не подтверждает его подлинность.
:::
