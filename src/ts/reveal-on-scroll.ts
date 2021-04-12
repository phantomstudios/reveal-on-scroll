import { IS_IE } from "./utils/platform";

const ON_SCROLL_CLASS = "reveal-on-scroll";
const VISIBLE_CLASS = "reveal-scrolled";
const HIDDEN_CLASS = "reveal-hidden";
const DELAY_BETWEEN_QUEUED_ELEMENTS = 150;

export class RevealOnScroll {
  private elements: HTMLElement[] = [];
  private readonly queueToShow: HTMLElement[] = [];
  private showNext = true;

  constructor() {
    // If Internet Explorer, ignore (Doesn't support intersectionObserver)...
    if (IS_IE) return;

    // Get elements to reveal
    this.elements = this.getAllElements();

    // Find visible elements on initial
    this.handleVisibleElements();

    // Listen for changes
    this.createListeners();
  }

  private getAllElements() {
    // Convert NodeList to element array
    return Array.from(
      document.querySelectorAll<HTMLElement>(`.${ON_SCROLL_CLASS}`)
    );
  }

  private createListeners() {
    window.addEventListener("scroll", this.handleVisibleElements);
    window.addEventListener("resize", this.handleVisibleElements);
    window.addEventListener("orientationchange", this.handleVisibleElements);
  }

  private removeListeners() {
    window.removeEventListener("scroll", this.handleVisibleElements);
    window.removeEventListener("resize", this.handleVisibleElements);
    window.removeEventListener("orientationchange", this.handleVisibleElements);
  }

  private readonly handleVisibleElements = () => {
    this.elements.forEach((element) => {
      const inQueue = this.queueToShow.find((item) => item === element);

      // If element is already in queue to show, visible or hidden, ignore
      if (inQueue || this.visible(element) || this.hidden(element)) return;

      // If items moved into view, add to queue
      if (this.hasElementMovedIntoView(element)) this.queueToShow.push(element);
    });

    // If items in queue, show them
    if (this.queueToShow.length > 0) this.showQueued();
  };

  private showQueued() {
    // If can show next and there's items in queue...
    if (this.showNext && this.queueToShow.length !== 0) {
      // Prevent another item from showing till this finishes stagger
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
          this.queueToShow.splice(0, 1);
        }

        // Show next element
        this.showNext = true;
        this.showQueued();
      }, DELAY_BETWEEN_QUEUED_ELEMENTS);
    }

    // If no elements left to be scrolled, remove listeners
    const elementsLeft = this.getAllElements();
    if (elementsLeft.length === 0) this.removeListeners();
  }

  private visible(element: Element) {
    return this.contains(element, VISIBLE_CLASS);
  }

  private hidden(element: Element) {
    return this.contains(element, HIDDEN_CLASS);
  }

  private contains(element: Element, className: string) {
    return element.classList.contains(className);
  }

  private hasElementMovedIntoView(element: Element) {
    const windowDistanceFromTop = window.scrollY;
    const windowHeight = windowDistanceFromTop + window.innerHeight;

    const elementRect = element.getBoundingClientRect();
    let elementDistanceFromTop = windowDistanceFromTop + elementRect.top;
    let elementHeight = elementDistanceFromTop + elementRect.height;

    // When an element is visible (shows when 20% visible)
    const threshold = (elementRect.height / 5) * 4;

    /**
     * Get scrolling direction, then update element distance from top / height
     * based on given threshold.
     */
    if (windowDistanceFromTop - elementDistanceFromTop >= 0) {
      // Scrolling top to bottom
      elementDistanceFromTop += threshold;
    } else {
      // Scrolling bottom to top
      elementHeight -= threshold;
    }

    // Return true if elements moved into view or false otherwise
    return (
      elementHeight <= windowHeight &&
      elementDistanceFromTop >= windowDistanceFromTop
    );
  }
}
