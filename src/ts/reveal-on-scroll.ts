import { IN_BROWSER, HAS_INTERSECTION_OBSERVER } from "./utils/platform";

const ON_SCROLL_CLASS = "reveal-on-scroll";
const VISIBLE_CLASS = "reveal-scrolled";
const HIDDEN_CLASS = "reveal-hidden";

export class RevealOnScroll {
  private _elements: HTMLElement[] = [];
  private readonly _queueToShow: HTMLElement[] = [];
  private _canRevealNext = true;
  private _delayBetweenQueuedElements!: number;
  private _thresholdToRevealElement!: number;

  constructor(
    delayBetweenQueuedElements = 150,
    thresholdToRevealElement = 0.2
  ) {
    // If not in browser, ignore
    if (!IN_BROWSER) return;

    this._elements = this.getAllElementsToReveal();
    this._delayBetweenQueuedElements = delayBetweenQueuedElements;
    this._thresholdToRevealElement = thresholdToRevealElement;

    // If intersectionObserver isn't supported (IE), force show all
    if (!HAS_INTERSECTION_OBSERVER) this.revealAllElements();
    else {
      const observer = this.createIntersectionObserver();
      this._elements.forEach((element) => observer.observe(element));
    }
  }

  private getAllElementsToReveal() {
    // Convert NodeList to element array
    return Array.from(
      document.querySelectorAll<HTMLElement>(`.${ON_SCROLL_CLASS}`)
    );
  }

  private revealAllElements() {
    this._elements.forEach((element) => element.classList.add(VISIBLE_CLASS));
  }

  private createIntersectionObserver() {
    return new IntersectionObserver((entries, observer) => {
      entries.forEach(
        (entry) => {
          if (entry.isIntersecting) {
            // Get element
            const element = entry.target as HTMLElement;

            // Find if element is already in queue
            const queued = this._queueToShow.includes(element);

            // Find if element is already visible/hidden
            const visible = element.classList.contains(VISIBLE_CLASS);
            const hidden = element.classList.contains(HIDDEN_CLASS);

            if (queued || visible || hidden) return;
            else {
              // todo: tweak threshold
              // const elementHeight = element.getBoundingClientRect().height;
              // const windowHeight = window.innerHeight;
              // let threshold = THRESHOLD_TO_SHOW;

              // // If element is too tall to ever hit threshold...
              // if (elementHeight > windowHeight * threshold) {
              //   // Reduce threshold
              //   threshold =
              //     ((windowHeight * threshold) / elementHeight) * threshold;
              // }

              // Add element to queue + reveal
              this._queueToShow.push(element);
              this.revealQueued();

              // Remove observer
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: this._thresholdToRevealElement }
      );
    });
  }

  private revealQueued() {
    // If can reveal next and there's items in queue...
    if (this._canRevealNext && this._queueToShow.length) {
      // Prevent another item from revealing till this finishes staggering
      this._canRevealNext = false;

      // Get element to show
      const element = this._queueToShow[0];

      setTimeout(() => {
        // If item hasn't already been shown...
        if (!element.classList.contains(VISIBLE_CLASS)) {
          // Trigger reveal
          element.classList.remove(ON_SCROLL_CLASS);
          element.classList.add(VISIBLE_CLASS);

          // Remove item from queue
          this._queueToShow.shift();
        }

        // Show next element
        this._canRevealNext = true;
        this.revealQueued();
      }, this._delayBetweenQueuedElements);
    }
  }
}
