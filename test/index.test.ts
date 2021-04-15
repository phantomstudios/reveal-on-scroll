import { ON_SCROLL_CLASS } from "../src/ts/reveal-on-scroll";

const getRevealElements = () =>
  document.querySelectorAll<HTMLElement>(`.${ON_SCROLL_CLASS}`);

describe("revealOnScroll()", function () {
  it('Each element in reveal array should have "classList" attribute', async () => {
    const elements = getRevealElements();

    elements.forEach((element) =>
      expect(element.hasOwnProperty("classList")).toBe(true)
    );
  });

  it('Each element in reveal array should have "getBoundingClientRect" attribute', async () => {
    const elements = getRevealElements();

    elements.forEach((element) =>
      expect(element.hasOwnProperty("getBoundingClientRect")).toBe(true)
    );
  });
});
