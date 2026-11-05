# Fastify

Поддерживает Fastify `^5.0.0`.

Импортируйте `undevice` из `undevice/fastify` и подключите `await app.register(undevice())`
до маршрутов. Каждый запрос получает отдельный замороженный результат в
`request.undevice`. После импорта адаптера стандартные флаги типизированы
в обработчиках автоматически.

## Подключение

```ts
import Fastify from 'fastify';
import { undevice } from 'undevice/fastify';

const app = Fastify();
await app.register(undevice());

app.get('/device', async (request, reply) => {
  request.undevice.isMobile; // boolean
  return reply.send(request.undevice);
});
```

## Типы пользовательских флагов

Расширьте `UndeviceCustomFlags` для типизации пользовательских флагов в маршрутах Fastify.

**Ручное описание**

Укажите в декларации имена пользовательских флагов с типом `boolean`.
Объявляйте только те флаги, которые переданы в настройки плагина:

::: code-group

```ts [undevice.d.ts]
import 'undevice/fastify';

declare module 'undevice/fastify' {
  interface UndeviceCustomFlags {
    isCustomFlag: boolean;
    isAnotherCustomFlag: boolean;
  }
}
```

:::

**Автовыведение из плагина**

`UndevicePluginFlags<typeof undevicePlugin>` выводит типы пользовательских
флагов из настроенного плагина:

::: code-group

```ts [app.ts]
import Fastify from 'fastify';
import { undevice } from 'undevice/fastify';

const app = Fastify();
export const undevicePlugin = undevice({
  isBot: ['bot'],
  isRawClient: ['curl', 'wget'],
});

await app.register(undevicePlugin);

app.get('/device', async (request, reply) => {
  request.undevice.isMobile;    // boolean
  request.undevice.isBot;       // boolean
  request.undevice.isRawClient; // boolean
  return reply.send(request.undevice);
});
```

```ts [undevice.d.ts]
import type { UndevicePluginFlags } from 'undevice/fastify';
import type { undevicePlugin } from './app.js';

type Flags = UndevicePluginFlags<typeof undevicePlugin>;

declare module 'undevice/fastify' {
  interface UndeviceCustomFlags extends Flags {}
}
```

:::

Включите `undevice.d.ts` в TypeScript-проект. Декларация действует для всех его
маршрутов Fastify.
