import { IN_BROWSER, HAS_INTERSECTION_OBSERVER } from "./utils/platform";

const ON_SCROLL_CLASS = "reveal-on-scroll";
const VISIBLE_CLASS = "reveal-scrolled";
const HIDDEN_CLASS = "reveal-hidden";

export class RevealOnScroll {
  protected _elements: HTMLElement[] = [];
  protected readonly _queueToShow: HTMLElement[] = [];
  protected _canRevealNext = true;
  protected _delayBetweenQueuedElements!: number;
  protected _thresholdToRevealElement!: number;

  constructor(
    delayBetweenQueuedElements = 150,
    thresholdToRevealElement = 0.2
  ) {
    // If not in browser (SSR), ignore
    if (!IN_BROWSER) return;

    this._elements = this.getAllElementsToReveal();

    // If intersectionObserver isn't supported (IE), force show all
    if (!HAS_INTERSECTION_OBSERVER) this.revealAllElements();
    else {
      this._delayBetweenQueuedElements = delayBetweenQueuedElements;
      this._thresholdToRevealElement = thresholdToRevealElement;

      const observer = this.createIntersectionObserver();
      this._elements.forEach((element) => observer.observe(element));
    }
  }

  protected getAllElementsToReveal() {
    // Convert NodeList to element array
    return Array.from(
      document.querySelectorAll<HTMLElement>(`.${ON_SCROLL_CLASS}`)
    );
  }

  protected revealAllElements() {
    this._elements.forEach((element) => element.classList.add(VISIBLE_CLASS));
  }

  protected createIntersectionObserver() {
    return new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Get element
          const element = entry.target as HTMLElement;

          const queued = this._queueToShow.includes(element);
          const alreadyVisible = element.classList.contains(VISIBLE_CLASS);
          const hidden = element.classList.contains(HIDDEN_CLASS);

          if (queued || alreadyVisible || hidden) return;
          else {
            if (!this.isElementPastRevealThreshold(element)) return;

            // Add element to queue + reveal
            this._queueToShow.push(element);
            this.revealQueued();

            // Remove observer
            observer.unobserve(entry.target);
          }
        }
      });
    });
  }

  protected isElementPastRevealThreshold(element: HTMLElement) {
    const elementRect = element.getBoundingClientRect();
    const viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    const threshold = elementRect.height * this._thresholdToRevealElement;

    const above = elementRect.bottom - threshold < 0;
    const below = elementRect.top - viewHeight + threshold >= 0;

    return !above && !below;
  }

  protected revealQueued() {
    // If can reveal next and there's items in queue...
    if (this._canRevealNext && this._queueToShow.length) {
      // Prevent another item from revealing till this finishes staggering
      this._canRevealNext = false;

      // Get element to show
      const element = this._queueToShow[0];

      // If element is already offscreen, reveal (won't see stagger)
      if (!this.isElementOnscreen) this.revealElement(element);
      else {
        setTimeout(() => {
          this.revealElement(element);
        }, this._delayBetweenQueuedElements);
      }
    }
  }

  protected isElementOnscreen(element: HTMLElement) {
    const elementRect = element.getBoundingClientRect();
    const viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    return !(elementRect.bottom < 0 || elementRect.top - viewHeight >= 0);
  }

  protected revealElement(element: HTMLElement) {
    const alreadyVisible = element.classList.contains(VISIBLE_CLASS);
    if (!alreadyVisible) {
      // Trigger reveal
      element.classList.remove(ON_SCROLL_CLASS);
      element.classList.add(VISIBLE_CLASS);

      // Remove item from queue
      this._queueToShow.shift();
    }

    // Show next element
    this._canRevealNext = true;
    this.revealQueued();
  }
}
