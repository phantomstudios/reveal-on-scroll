# reveal-on-scroll

[![NPM version][npm-image]][npm-url]
[![Actions Status][ci-image]][ci-url]
[![PR Welcome][npm-downloads-image]][npm-downloads-url]

Lightweight library to reveal elements on scroll as you scroll down or up.

Can be used standalone as pure TS implementation, or alongside it's full optional CSS animation library (Coming Soon as seen below!).

Also SSR safe and won't break build if pre-rendered.

## Installation

Install this package with `npm`.

```bash
npm i @phntms/reveal-on-scroll
```

## Usage

To use, initialize a new `RevealOnScroll()` component.

```ts
import RevealOnScroll from "@pnhtms/reveal-on-scroll";

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

  // Used to querySelectAll with the following
  revealSelector: ".reveal-on-scroll",

  // Class added to element when revealed
  visibleClass: "reveal-scrolled",

  // If used alongside revealSelector, ignores reveal events till removed
  hiddenClass: "reveal-hidden",
});
```

Then to use, simply add the `reveal-on-scroll` class to any `HTMLElement`. For example:

```html
<div class="reveal-on-scroll"></div>
```

Additionally use `reveal-hidden` to prevent elements being revealed till ready, for example the following won't be revealed until `reveal-hidden` is removed:

```html
<div class="reveal-on-scroll reveal-hidden"></div>
```

## 🍪 Recipes:

The library works by adding `reveal-scrolled` to any `reveal-on-scroll` elements.

To animate, simply hook into this with any custom CSS, for example:

```scss
$ease-out: cubic-bezier(0.3, 1, 0.7, 1);

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.8s $ease-out, transform 0.6s $ease-out;

  &.reveal-scrolled {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Browser Support

This library utilizes `intersectionObserver`, as such browser support is pretty good (par IE11 and below), for more information check [caniuse](https://caniuse.com/intersectionobserver). For fallback, `reveal-scrolled` is automatically added to all `reveal-on-scroll` elements to ensure older browsers still reveal content.

If you need `reveal-on-scroll` to work on any browser that doesn't support `intersectionObserver` consider using a polyfill such as - [intersection-observer](https://www.npmjs.com/package/intersection-observer).

### Planned

Features planned in future releases:

- Full test coverage.
- Optional reset to hide any revealed elements out of viewport view.
- Optional CSS animation library that can be imported and used alongside TS implementation.

## 🍰 Contributing

Want to get involved, or found an issue? Please contribute using the GitHub Flow. Create a branch, add commits, and open a Pull Request or submit a new issue.

Please read `CONTRIBUTING` for details on our `CODE_OF_CONDUCT`, and the process for submitting pull requests to us!

[npm-image]: https://img.shields.io/npm/v/@phntms/reveal-on-scroll.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@phntms/reveal-on-scroll
[npm-downloads-image]: https://img.shields.io/npm/dm/@phntms/reveal-on-scroll.svg
[npm-downloads-url]: https://npmcharts.com/compare/@phntms/reveal-on-scroll?minimal=true
[ci-image]: https://github.com/phantomstudios/reveal-on-scroll/workflows/test/badge.svg
[ci-url]: https://github.com/phantomstudios/reveal-on-scroll/actions
