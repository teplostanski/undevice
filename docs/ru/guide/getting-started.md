# Начало работы

::: code-group

```sh [npm]
npm install undevice
```

```sh [pnpm]
pnpm add undevice
```

```sh [yarn]
yarn add undevice
```

```sh [bun]
bun add undevice
```

:::

## Первый вызов

Создайте детектор один раз, затем передавайте заголовки каждого входящего запроса в `detect()`:

```ts
import { undevice } from "undevice";

const { detect } = undevice();
const device = detect({ headers: request.headers });

device.isMobile;
device.isTablet;
device.isDesktop;
```

`undevice()` возвращает замороженный объект с методом `detect`. Каждый вызов `detect()`
возвращает новый замороженный [UndeviceResult](/api/type-aliases/UndeviceResult) с [флагами](/ru/guide/detection#результат).

Библиотека не изменяет входные данные и не обращается неявно к контексту запроса или глобальным объектам браузера.

### User-Agent

В браузере передайте `navigator.userAgent`:

```ts
import { undevice } from "undevice";

const { detect } = undevice();
const device = detect({ userAgent: navigator.userAgent });
```

Чтобы переопределить User-Agent:

```ts
const device = detect({
  headers: request.headers,
  userAgent: customUserAgent,
});
```

При SSR используйте на клиенте результат, полученный на сервере, чтобы избежать расхождений при гидратации.
