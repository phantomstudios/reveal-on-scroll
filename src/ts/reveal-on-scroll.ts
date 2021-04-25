import { IN_BROWSER, HAS_INTERSECTION_OBSERVER } from "./utils/platform";
import {
  Config,
  DEFAULT_CONFIG,
  HIDDEN_CLASS,
  REVEAL_CLASS,
  VISIBLE_CLASS,
} from "./utils/types";

class RevealOnScroll {
  config!: Config;
  readonly elements: Element[] = [];
  readonly _queueToShow: Element[] = [];
  private _intersectionObserver!: IntersectionObserver;
  private _canRevealNext = true;

  constructor(config?: Config) {
    // If not in browser (SSR), ignore
    if (!IN_BROWSER) return;

    this.elements = this.getAllElementsToReveal();

    // If intersectionObserver isn't supported (IE), force show all
    if (!HAS_INTERSECTION_OBSERVER) this.revealAllElements();
    else {
      this.config = Object.assign(config, DEFAULT_CONFIG);
      this._intersectionObserver = this._createIntersectionObserver();
      this._observeElements(this.elements);
    }
  }

  getAllElementsToReveal() {
    return Array.from(document.getElementsByClassName(REVEAL_CLASS));
  }

  revealAllElements() {
    this.elements.forEach((element) => element.classList.add(VISIBLE_CLASS));
  }

  private _createIntersectionObserver() {
    return new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Get element
          const element = entry.target as Element;

          const queued = this._queueToShow.includes(element);
          const alreadyVisible = element.classList.contains(VISIBLE_CLASS);
          const hidden = element.classList.contains(HIDDEN_CLASS);

          if (queued || alreadyVisible || hidden) return;
          else {
            if (!this.isElementPastRevealThreshold(element)) return;

            // Add element to queue + reveal
            this._queueToShow.push(element);
            this._revealQueued();

            // Remove observer
            observer.unobserve(entry.target);
          }
        }
      });
    });
  }

  private _observeElements(elements: Element[]) {
    elements.forEach((element) => this._intersectionObserver.observe(element));
  }

  isElementPastRevealThreshold(element: Element) {
    const elementRect = element.getBoundingClientRect();
    const viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    const threshold =
      elementRect.height * this.config.thresholdToRevealElements;

    const above = elementRect.bottom - threshold < 0;
    const below = elementRect.top - viewHeight + threshold >= 0;

    return !above && !below;
  }

  private _revealQueued() {
    // If can reveal next and there's items in queue...
    if (this._canRevealNext && this._queueToShow.length) {
      // Prevent another item from revealing till this finishes staggering
      this._canRevealNext = false;

      // Get oldest element from stack to reveal
      const element = this._queueToShow.shift() as Element;

      // If element is already offscreen, reveal (won't see stagger)
      if (!this.isElementOnscreen) {
        this.revealElement(element);
        this._revealNextElement();
      } else {
        setTimeout(() => {
          this.revealElement(element);
          this._revealNextElement();
        }, this.config.delayBetweenQueuedElements);
      }
    }
  }

  isElementOnscreen(element: Element) {
    const elementRect = element.getBoundingClientRect();
    const viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    return !(elementRect.bottom < 0 || elementRect.top - viewHeight >= 0);
  }

  revealElement(element: Element) {
    const alreadyVisible = element.classList.contains(VISIBLE_CLASS);
    if (!alreadyVisible) element.classList.add(VISIBLE_CLASS);
  }

  private _revealNextElement() {
    this._canRevealNext = true;
    this._revealQueued();
  }

  refresh() {
    const allElements = this.getAllElementsToReveal();
    const newElements = this.elements.filter((x) => !allElements.includes(x));
    this._observeElements(newElements);
    this.elements.concat(newElements);
  }
}

export default RevealOnScroll;
