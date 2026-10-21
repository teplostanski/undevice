# CDN

## CloudFront

Если User-Agent равен `Amazon CloudFront` без учёта регистра, проверяются следующие заголовки:

- `CloudFront-Is-Android-Viewer`
- `CloudFront-Is-Desktop-Viewer`
- `CloudFront-Is-IOS-Viewer`
- `CloudFront-Is-Mobile-Viewer`
- `CloudFront-Is-Tablet-Viewer`

Передавайте заголовки запроса через `headers`. Если ни один заголовок типа устройства
не имеет значения `true`, результат содержит `isUnknown: true`.

> [!CAUTION]
> CloudFront не предоставляет заголовки для определения Windows или macOS.

[Настройка заголовков типа устройства в CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/adding-cloudfront-headers.html#cloudfront-headers-device-type).

## Cloudflare

Если правило CloudFront не сработало и `CF-Device-Type` содержит `mobile`, `tablet`
или `desktop`, это значение имеет
приоритет над User-Agent при определении типа устройства. Если заголовок отсутствует
или его значение не распознано, используется User-Agent.

[Настройка кеширования по типу устройства в Cloudflare APO](https://developers.cloudflare.com/automatic-platform-optimization/reference/cache-device-type/).
