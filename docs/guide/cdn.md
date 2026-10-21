# CDN

## CloudFront

When the User-Agent matches `Amazon CloudFront` case-insensitively, the following headers are checked:

- `CloudFront-Is-Android-Viewer`
- `CloudFront-Is-Desktop-Viewer`
- `CloudFront-Is-IOS-Viewer`
- `CloudFront-Is-Mobile-Viewer`
- `CloudFront-Is-Tablet-Viewer`

Pass request headers via `headers`. If no device type header is `true`,
the result includes `isUnknown: true`.

> [!CAUTION]
> CloudFront does not provide headers for detecting Windows or macOS.

[Configure device type headers in CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/adding-cloudfront-headers.html#cloudfront-headers-device-type).

## Cloudflare

If the CloudFront rule does not apply and `CF-Device-Type` is `mobile`, `tablet`,
or `desktop`, that value takes precedence over the User-Agent for device type
detection. If the header is missing or its value is unrecognized, detection
falls back to the User-Agent.

[Configure Cache by device type in Cloudflare APO](https://developers.cloudflare.com/automatic-platform-optimization/reference/cache-device-type/).
