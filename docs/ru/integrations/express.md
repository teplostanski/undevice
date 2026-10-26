# Express

Поддерживает Express `^4.18.0 || ^5.0.0`.

Импортируйте `undevice` из `undevice/express` и подключите `app.use(undevice())`
до маршрутов. Каждый запрос получает отдельный замороженный результат в
`res.locals.undevice`. После импорта адаптера стандартные флаги типизированы
в обработчиках автоматически.

## Подключение

```ts
import express from 'express';
import { undevice } from 'undevice/express';

const app = express();
app.use(undevice());

app.get('/device', (_req, res) => {
  res.locals.undevice.isMobile; // boolean
  res.json(res.locals.undevice);
});
```

## Типы пользовательских флагов

Расширьте `UndeviceCustomFlags` для типизации пользовательских флагов в маршрутах Express.

**Ручное описание**

Укажите в декларации имена пользовательских флагов с типом `boolean`.
Объявляйте только те флаги, которые переданы в настройки middleware:

::: code-group

```ts [undevice.d.ts]
import 'undevice/express';

declare module 'undevice/express' {
  interface UndeviceCustomFlags {
    isCustomFlag: boolean;
    isAnotherCustomFlag: boolean;
  }
}
```

:::

**Автовыведение из middleware**

`UndeviceMiddlewareFlags<typeof undeviceMiddleware>` выводит типы пользовательских
флагов из настроенной middleware:

::: code-group

```ts [app.ts]
import express from 'express';
import { undevice } from 'undevice/express';

const app = express();
export const undeviceMiddleware = undevice({
  isBot: ['bot'],
  isRawClient: ['curl', 'wget'],
});

app.use(undeviceMiddleware);

app.get('/device', (_req, res) => {
  res.locals.undevice.isMobile;    // boolean
  res.locals.undevice.isBot;       // boolean
  res.locals.undevice.isRawClient; // boolean
  res.json(res.locals.undevice);
});
```

```ts [undevice.d.ts]
import type { UndeviceMiddlewareFlags } from 'undevice/express';
import type { undeviceMiddleware } from './app.js';

type Flags = UndeviceMiddlewareFlags<typeof undeviceMiddleware>;

declare module 'undevice/express' {
  interface UndeviceCustomFlags extends Flags {}
}
```

:::

Включите `undevice.d.ts` в TypeScript-проект. Декларация действует для всех его
маршрутов Express.
