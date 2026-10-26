---
layout: home
hero:
  name: undevice
  text: Единый детектор устройств
  tagline: Определение устройства, ОС и браузера по заголовкам. Без зависимостей, с TypeScript и поддержкой CDN.
  image:
    light: /logo-light.svg
    dark: /logo-dark.svg
    alt: undevice
  actions:
    - theme: brand
      text: Начать
      link: /ru/guide/getting-started
    - theme: alt
      text: Попробовать
      link: /ru/playground
    - theme: alt
      text: Интеграции
      link: /ru/integrations/
    - theme: alt
      text: GitHub
      link: https://github.com/teplostanski/undevice
features:
  - title: Любая среда
    details: Node.js, браузер или edge. Вы передаёте данные, undevice возвращает флаги.
  - title: Кастомные флаги
    details: Добавляйте собственные флаги определения устройства с автоматическим выводом типов.
  - title: Сигналы CDN
    details: Cloudflare и CloudFront с определённым приоритетом над User-Agent.
  - title: Интеграции
    details: Готовая middleware для Express с типизированными флагами в обработчиках маршрутов.
    link: /ru/integrations/
    linkText: Все интеграции
---

::: code-group

```ts twoslash [Простое использование]
import { undevice } from "undevice";

const { detect } = undevice();
const device = detect({ userAgent: navigator.userAgent });

device.isMobile;
device.isDesktop;
device.isWindows;
device.isChrome;
```

```ts twoslash [Пользовательские флаги]
// В примере используется сторонняя библиотека isbot
import { isbot } from "isbot";
import { undevice } from "undevice";

// Настройка пользовательских флагов
const { detect } = undevice({
  isCrawler: isbot,
  isRawClient: ["curl", "wget"],
});
const device = detect({ userAgent: navigator.userAgent });

device.isMobile;
device.isDesktop;
device.isWindows;
device.isChrome;

// Использование пользовательских флагов
device.isCrawler;
device.isRawClient;
```

:::
