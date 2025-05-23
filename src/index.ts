import { RevealConfig, DEFAULT_REVEAL_CONFIG } from "./types";
import { IS_BROWSER, HAS_INTERSECTION_OBSERVER } from "./utils/platform";

class RevealOnScroll {
  private _config!: RevealConfig;
  public readonly elements: Element[] = [];
  private readonly _queueToShow: Element[] = [];
  private _intersectionObserver!: IntersectionObserver;
  private _canRevealNext = true;

  constructor(config?: Partial<RevealConfig>) {
    // If not in browser (SSR), ignore
    if (!IS_BROWSER) return;

    this._config = { ...DEFAULT_REVEAL_CONFIG, ...config };
    this.elements = this.getAllElementsToReveal();

    // If intersectionObserver isn't supported (IE), force show all
    if (!HAS_INTERSECTION_OBSERVER) this.revealAllElements();
    else {
      this._intersectionObserver = this._createIntersectionObserver();
      this._observeElements(this.elements);
    }
  }

  getAllElementsToReveal() {
    return Array.from(document.querySelectorAll(this._config.revealSelector));
  }

  revealAllElements() {
    this.elements.forEach((element) =>
      element.classList.add(this._config.visibleClass),
    );
  }

  private _createIntersectionObserver() {
    return new IntersectionObserver(
      (entries, observer) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => {
            // Get element
            const element = entry.target as Element;

            const queued = this._queueToShow.includes(element);
            const alreadyVisible = element.classList.contains(
              this._config.visibleClass,
            );
            const hidden = element.classList.contains(this._config.hiddenClass);

            if (queued || alreadyVisible || hidden) return;
            else {
              // Add element to queue + reveal
              this._queueToShow.push(element);
              this._revealQueued();

              // Remove observer
              observer.unobserve(entry.target);
            }
          });
      },
      { threshold: this._config.thresholdToRevealElements },
    );
  }

  private _observeElements(elements: Element[]) {
    elements.forEach((element) => this._intersectionObserver.observe(element));
  }

  private _revealQueued() {
    // If can reveal next and there's items in queue...
    if (this._canRevealNext && this._queueToShow.length) {
      // Prevent another item from revealing till this finishes staggering
      this._canRevealNext = false;

      // Get oldest element from stack to reveal
      const element = this._queueToShow.shift();
      if (!element) return;

      // If element is already offscreen, reveal (won't see stagger)
      if (!this.isElementOnscreen(element)) {
        this.revealElement(element);
        this._revealNextElement();
      } else {
        setTimeout(() => {
          this.revealElement(element);
          this._revealNextElement();
        }, this._config.delayBetweenQueuedElements);
      }
    }
  }

  isElementOnscreen(element: Element) {
    const elementRect = element.getBoundingClientRect();
    const viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight,
    );
    return !(elementRect.bottom < 0 || elementRect.top - viewHeight >= 0);
  }

  revealElement(element: Element) {
    const alreadyVisible = element.classList.contains(
      this._config.visibleClass,
    );
    if (!alreadyVisible) element.classList.add(this._config.visibleClass);
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
export type { RevealConfig, DEFAULT_REVEAL_CONFIG };
