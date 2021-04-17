import { getAllElementsToReveal } from "../src/ts/utils/helpers";

describe("revealOnScroll()", function () {
  it('Each element in reveal array should have "classList" attribute', async () => {
    const elements = getAllElementsToReveal();

    elements.forEach((element) =>
      expect(element.hasOwnProperty("classList")).toBe(true)
    );
  });

  it('Each element in reveal array should have "getBoundingClientRect" attribute', async () => {
    const elements = getAllElementsToReveal();

    elements.forEach((element) =>
      expect(element.hasOwnProperty("getBoundingClientRect")).toBe(true)
    );
  });
});
