# Параметры и результат

`detect(options)` принимает параметры, описанные ниже. Если передать `{}` без заголовков
и User-Agent, тип устройства будет неизвестным.

```ts
type UndeviceOptions = Readonly<{
  headers?: RequestHeaders;
  userAgent?: string;
}>;
```

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `headers` | [`RequestHeaders`](/api/type-aliases/RequestHeaders) | `undefined` | Заголовки запроса. Принимает стандартный объект [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) или обычный объект, в том числе заголовки запроса Node.js. |
| `userAgent` | `string` | Из `headers` | Используется вместо значения заголовка `user-agent`. Также позволяет определять устройство только по UA. |

### Результат

[`UndeviceResult`](/api/type-aliases/UndeviceResult) содержит следующие встроенные флаги типа `boolean`:

| Группа | Флаги |
| --- | --- |
| Устройство | `isMobile`, `isTablet`, `isDesktop`, `isUnknown` |
| Комбинированные | `isMobileOrTablet`, `isDesktopOrTablet` |
| ОС | `isIos`, `isAndroid`, `isWindows`, `isMacOS`, `isLinux`, `isApple` |
| Браузер | `isChrome`, `isFirefox`, `isSafari`, `isEdge`, `isSamsung` |

`isUnknown` равен `true`, если по входным данным не удалось определить тип устройства.
Пользовательские флаги добавляются к этому же объекту результата.
