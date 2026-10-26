# Пользовательские флаги

Чтобы добавить свои флаги, передайте объект в `undevice()`. Каждый ключ станет именем
флага в результате.
TypeScript автоматически выводит имена пользовательских флагов и их тип `boolean`.

Значение каждого ключа может быть:

- Функцией `(ua: string) => boolean`. Она получает User-Agent без пробелов по краям, приведённый к нижнему регистру.
- Массивом строк для поиска подстрок в User-Agent без учёта регистра. Проверка возвращает `true` при совпадении хотя бы одной подстроки. Специальные символы, например `.` и `*`, обрабатываются буквально.
- Объектом с обязательным `detect` и необязательным `exclude`. Оба поля принимают функцию или массив строк. Если проверка `exclude` возвращает `true`, флаг получает значение `false`, а проверка `detect` не выполняется. Иначе значение флага определяется проверкой `detect`.

Функция проверки:

```ts twoslash
import { undevice } from "undevice";

const { detect } = undevice({
  isCrawler: (ua: string) => /googlebot/i.test(ua),
});
```

Массив подстрок:

```ts twoslash
import { undevice } from "undevice";

const { detect } = undevice({
  isRawClient: ["curl", "wget"],
});
```

Проверка с исключениями из массива:

```ts twoslash
import { undevice } from "undevice";

import { isbot } from "isbot";

const { detect } = undevice({
  isCrawler: {
    detect: isbot,
    exclude: ["curl", "wget"],
  },
});
```

Массив подстрок в `detect` и функция в `exclude`:

```ts twoslash
import { undevice } from "undevice";

const { detect } = undevice({
  isCrawler: {
    detect: ["bot", "crawler", "spider"],
    exclude: (ua: string) => ua.includes("my-health-checker"),
  },
});
```

#### Примеры со сторонними библиотеками

**isCrawler с isbot**

Используйте [isbot](https://github.com/omrilotan/isbot) для распознавания User-Agent ботов:

```bash
npm install isbot
```

```ts twoslash
import { isbot } from "isbot";
import { undevice } from "undevice";

const { detect } = undevice({ isCrawler: isbot });
const device = detect({ userAgent: navigator.userAgent });

device.isCrawler;
```

**isCrawler с crawler-user-agents**

Проверку также можно построить на шаблонах из
[crawler-user-agents](https://github.com/monperrus/crawler-user-agents).
Создайте регулярные выражения один раз при настройке детектора:

```bash
npm install crawler-user-agents
```

```ts twoslash
// @resolveJsonModule: true
import crawlers from "crawler-user-agents" with { type: "json" };
import { undevice } from "undevice";

const patterns = crawlers.map(({ pattern }) => new RegExp(pattern, "i"));

const { detect } = undevice({
  isCrawler: (ua: string) => patterns.some((pattern) => pattern.test(ua)),
});

const device = detect({ userAgent: navigator.userAgent });

device.isCrawler;
```
