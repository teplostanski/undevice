---
layout: home
hero:
  name: undevice
  text: Узнайте устройство. Добавьте свои флаги.
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
      text: GitHub
      link: https://github.com/teplostanski/undevice
features:
  - title: Любая среда
    details: Node.js, браузер или edge. Вы передаёте данные, undevice возвращает флаги.
  - title: Ваши проверки
    details: Коллбэки, массивы подстрок и исключения. Кастомные флаги с выводом типов.
  - title: Сигналы CDN
    details: Cloudflare и CloudFront с определённым приоритетом над User-Agent.
  - title: Один детектор
    details: Настройте один раз. Получайте новый неизменяемый результат для каждого запроса.
---

```ts twoslash
import { isbot } from "isbot";
import { undevice } from "undevice";

const { detect } = undevice({
  isCrawler: isbot,
  isRawClient: ["curl", "wget"],
});
const device = detect({ userAgent: navigator.userAgent });

device.isMobile;
device.isDesktop;
device.isWindows;
device.isChrome;
device.isCrawler;
device.isRawClient;
```
