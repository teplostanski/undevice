# Пользовательские флаги

Чтобы добавить свои флаги, передайте объект в `undevice()`. Каждый ключ станет именем
флага в результате.

Значение каждого ключа может быть:

- Функцией `(ua: string) => boolean`. Она получает User-Agent без пробелов по краям, приведённый к нижнему регистру.
- Массивом строк для поиска подстрок в User-Agent без учёта регистра. Проверка возвращает `true` при совпадении хотя бы одной подстроки. Специальные символы, например `.` и `*`, обрабатываются буквально.
- Объектом с обязательным `detect` и необязательным `exclude`. Оба поля принимают функцию или массив строк. Если проверка `exclude` возвращает `true`, флаг получает значение `false`, а проверка `detect` не выполняется. Иначе значение флага определяется проверкой `detect`.

Функция проверки:

```ts
const { detect } = undevice({
  isCrawler: (ua) => /googlebot/i.test(ua),
});
```

Массив подстрок:

```ts
const { detect } = undevice({
  isRawClient: ["curl", "wget"],
});
```

Проверка с исключениями из массива:

```ts
import { isbot } from "isbot";

const { detect } = undevice({
  isCrawler: {
    detect: isbot,
    exclude: ["curl", "wget"],
  },
});
```

Массив подстрок в `detect` и функция в `exclude`:

```ts
const { detect } = undevice({
  isCrawler: {
    detect: ["bot", "crawler", "spider"],
    exclude: (ua) => ua.includes("my-health-checker"),
  },
});
```

#### Примеры со сторонними библиотеками

В качестве проверки можно передать функцию из сторонней библиотеки или использовать её данные в своём коллбэке. Ниже приведены примеры с `isbot` и `crawler-user-agents`.

**isCrawler с isbot**

Используйте [isbot](https://github.com/omrilotan/isbot) для распознавания User-Agent ботов:

```bash
npm install isbot
```

```ts
import { isbot } from "isbot";
import { undevice } from "undevice";

const { detect } = undevice({ isCrawler: isbot });
const device = detect({ headers: request.headers });

device.isCrawler; // boolean
```

**isCrawler с crawler-user-agents**

Проверку также можно построить на шаблонах из
[crawler-user-agents](https://github.com/monperrus/crawler-user-agents).
Создайте регулярные выражения один раз при настройке детектора:

```bash
npm install crawler-user-agents
```

```ts
import crawlers from "crawler-user-agents" with { type: "json" };
import { undevice } from "undevice";

const patterns = crawlers.map(({ pattern }) => new RegExp(pattern, "i"));

const { detect } = undevice({
  isCrawler: (ua) => patterns.some((pattern) => pattern.test(ua)),
});

const device = detect({ headers: request.headers });

device.isCrawler; // boolean
```

## Вывод типов

```ts twoslash
import { undevice } from "undevice";

const { detect } = undevice({ isRawClient: ["curl", "wget"] });
const device = detect({ userAgent: "curl/8.0" });
device.isRawClient;
//     ^?
```
