import fs from "fs";
import path from "path";

import RevealOnScroll from "../src/ts/reveal-on-scroll";
import { getAllElementsToReveal } from "../src/ts/utils/helpers";
import { VISIBLE_CLASS } from "../src/ts/utils/types";

const FIXTURE_PATH = "./index.fixture.html";
const html = fs.readFileSync(path.resolve(__dirname, FIXTURE_PATH), "utf8");
jest.dontMock("fs");

describe("RevealOnScroll()", function () {
  // Create fixture
  beforeEach(() => (document.documentElement.innerHTML = html.toString()));
  afterEach(() => jest.resetModules());

  it('Each element in reveal array should have "classList" property', async () => {
    const elements = getAllElementsToReveal();
    elements.forEach((element) => expect(element.classList).toBeDefined());
  });

  it('Each element in reveal array should have "getBoundingClientRect" property', async () => {
    const elements = getAllElementsToReveal();
    elements.forEach((element) =>
      expect(element.getBoundingClientRect).toBeDefined()
    );
  });

  it("Should be able to define new RevealOnScroll()", async () => {
    const revealOnScroll = new RevealOnScroll();
    expect(revealOnScroll).toBeDefined();
  });

  it("Should reveal all elements if `intersectionObserver` isn't available", async () => {
    new RevealOnScroll();
    const elements = getAllElementsToReveal();
    elements.forEach((element) => {
      expect(element.classList.contains(VISIBLE_CLASS)).toBe(true);
    });
  });

  it("Should only reveal elements if within viewport and not reveal-hidden", async () => {});

  it("Should reveal elements if within viewport after reveal-hidden is removed", async () => {});

  it("Should only reveal element if past threshold", async () => {});
});
