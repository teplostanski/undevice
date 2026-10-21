# Input and result

`detect(options)` accepts the options below. Pass `{}` without headers
or a User-Agent to get an unknown device type.

```ts
type UndeviceOptions = Readonly<{
  headers?: RequestHeaders;
  userAgent?: string;
}>;
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `headers` | [`RequestHeaders`](/api/type-aliases/RequestHeaders) | `undefined` | Request headers. Accepts a standard [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) instance or a plain record, including Node.js request headers. |
| `userAgent` | `string` | From `headers` | Used instead of the `user-agent` header value. Also supports standalone UA detection. |

### Result

[`UndeviceResult`](/api/type-aliases/UndeviceResult) contains the following built-in boolean flags:

| Group | Flags |
| --- | --- |
| Device | `isMobile`, `isTablet`, `isDesktop`, `isUnknown` |
| Combined | `isMobileOrTablet`, `isDesktopOrTablet` |
| OS | `isIos`, `isAndroid`, `isWindows`, `isMacOS`, `isLinux`, `isApple` |
| Browser | `isChrome`, `isFirefox`, `isSafari`, `isEdge`, `isSamsung` |

`isUnknown` is `true` when the input does not resolve to a device type.
Custom flags are added to the same result object.
