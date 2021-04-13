import { IN_BROWSER, HAS_INTERSECTION_OBSERVER } from "./utils/platform";

const ON_SCROLL_CLASS = "reveal-on-scroll";
const VISIBLE_CLASS = "reveal-scrolled";
const HIDDEN_CLASS = "reveal-hidden";
const DELAY_BETWEEN_QUEUED_ELEMENTS = 150;
const THRESHOLD_TO_SHOW = 0.2;

export class RevealOnScroll {
  private elements: HTMLElement[] = [];
  private readonly queueToShow: HTMLElement[] = [];
  private showNext = true;

  constructor() {
    // If not in browser, ignore
    if (!IN_BROWSER) return;

    // Get elements to reveal
    this.elements = this.getAllElements();

    // If intersectionObserver isn't supported (IE), force show all
    if (!HAS_INTERSECTION_OBSERVER) this.showAll();
    else {
      // Create intersectionObserver
      const observer = this.createIntersectionObserver();

      // Add elements to observer
      this.elements.forEach((element) => observer.observe(element));
    }
  }

  private getAllElements() {
    // Convert NodeList to element array
    return Array.from(
      document.querySelectorAll<HTMLElement>(`.${ON_SCROLL_CLASS}`)
    );
  }

  private showAll() {
    this.elements.forEach((element) => element.classList.add(VISIBLE_CLASS));
  }

  private createIntersectionObserver() {
    return new IntersectionObserver((entries, observer) => {
      entries.forEach(
        (entry) => {
          // If items moved into view, add to queue
          if (entry.isIntersecting) {
            // Get element
            const element = entry.target as HTMLElement;

            // Find if element is already in queue
            const queued = this.queueToShow.includes(element);

            // If element is hidden
            const hidden = element.classList.contains(HIDDEN_CLASS);

            // If element is already in queue to show, visible or hidden, ignore
            if (queued || this.visible(element) || hidden) return;
            else {
              // const elementHeight = element.getBoundingClientRect().height;
              // const windowHeight = window.innerHeight;
              // let threshold = THRESHOLD_TO_SHOW;

              // // If element is too tall to ever hit threshold...
              // if (elementHeight > windowHeight * threshold) {
              //   // Reduce threshold
              //   threshold =
              //     ((windowHeight * threshold) / elementHeight) * threshold;
              // }

              // Else, queue
              this.queueToShow.push(element);

              // Remove observer
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: THRESHOLD_TO_SHOW }
      );
    });
  }

  private showQueued() {
    // If can show next and there's items in queue...
    if (this.showNext && this.queueToShow.length) {
      // Prevent another item from showing till this finishes staggering
      this.showNext = false;

      // Get element to show
      const element = this.queueToShow[0];

      // Wait DELAY_BETWEEN_QUEUED_ELEMENTS (in ms) before showing element
      setTimeout(() => {
        // If item hasn't already been shown...
        if (!this.visible(element)) {
          // Replace element listener class with visible class to trigger show
          element.classList.remove(ON_SCROLL_CLASS);
          element.classList.add(VISIBLE_CLASS);

          // Remove item from queue
          this.queueToShow.shift();
        }

        // Show next element
        this.showNext = true;
        this.showQueued();
      }, DELAY_BETWEEN_QUEUED_ELEMENTS);
    }
  }

  private visible(element: Element) {
    return element.classList.contains(VISIBLE_CLASS);
  }
}
