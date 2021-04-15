# reveal-on-scroll

[![NPM version][npm-image]][npm-url]
[![Actions Status][ci-image]][ci-url]
[![PR Welcome][npm-downloads-image]][npm-downloads-url]

Lightweight library to reveal elements on scroll as you scroll down or up.

Currently only TS implementation, with full optional CSS animations planned in a future release.

## Installation

Install this package with `npm`.

```bash
npm i @phntms/reveal-on-scroll
```

## Usage

To use, initialize a new `RevealOnScroll()` component.

```ts
new RevealOnScroll();

// Or...

new RevealOnScroll({
  /**
   * If multiple elements are visible at same time, this defines the delay
   * before showing next element.
   *
   * Set to 0 to remove default stagger.
   */
  delayBetweenQueuedElements: 150,

  // Threshold of element that has to be in view, before revealing element
  thresholdToRevealElements: 0.2,
});
```

Then to use, simply add the `reveal-on-scroll` class to any `HTMLElement`. For example:

```html
<div class="reveal-on-scroll"></div>
```

The library works by swapping out any visible `reveal-on-scroll` with `reveal-scrolled`.

To animate, simply hook into this with any custom CSS, for example:

```scss
$ease-out: cubic-bezier(0.3, 1, 0.7, 1);

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(32px);
}

.reveal-scrolled {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.8s $ease-out, transform 0.6s $ease-out;
}
```

This library also supports `reveal-hidden` to prevent elements being revealed till ready, for example the following will be ignored till `reveal-hidden` is removed.

```html
<div class="reveal-on-scroll reveal-hidden"></div>
```

### Browser Support

This library utilizes `intersectionObserver`, as such browser support is pretty good, for more information check [caniuse](https://caniuse.com/intersectionobserver).

For fallback, all instances of `reveal-on-scroll` are automatically replaced with `reveal-scrolled` to ensure older browsers still reveal content.

If you need `reveal-on-scroll` to work on any browser that doesn't support `intersectionObserver` consider using a polyfill such as this - [intersection-observer](https://www.npmjs.com/package/intersection-observer).

### Planned

Features planned in future releases:

- Optional reset to hide any revealed elements below current window height. For example, if you reveal an element, but then scroll up, automatically hide that element if you scroll up past its reveal threshold.
- Optional CSS animation library that can be imported and used alongside TS implementation.

## 🍰 Contributing

Please contribute using GitHub Flow. Create a branch, add commits, and open a Pull Request.

Please read `CONTRIBUTING` for details on our `CODE_OF_CONDUCT`, and the process for submitting pull requests to us!

[npm-url]: https://npmjs.org/package/@phntms/reveal-on-scroll
[npm-downloads-image]: https://img.shields.io/npm/dm/@phntms/reveal-on-scroll.svg
[npm-downloads-url]: https://npmcharts.com/compare/@phntms/reveal-on-scroll?minimal=true
[ci-image]: https://github.com/phantomstudios/reveal-on-scroll/workflows/Test/badge.svg
[ci-url]: https://github.com/phantomstudios/reveal-on-scroll/actions
