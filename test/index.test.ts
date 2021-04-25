import fs from "fs";
import path from "path";

import RevealOnScroll from "../src/ts/reveal-on-scroll";
import { VISIBLE_CLASS } from "../src/ts/utils/types";

const FIXTURE_PATH = "./index.fixture.html";
const html = fs.readFileSync(path.resolve(__dirname, FIXTURE_PATH), "utf8");
jest.dontMock("fs");

describe("RevealOnScroll()", function () {
  let revealOnScroll: RevealOnScroll;

  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    revealOnScroll = new RevealOnScroll();
  });

  afterEach(() => jest.resetModules());

  it("Should be able to define new RevealOnScroll()", async () => {
    expect(revealOnScroll).toBeDefined();
  });

  it("Elements list should be accessible", async () => {
    expect(revealOnScroll.elements).toBeDefined();
  });

  it("Should have refresh() method", async () => {
    expect(revealOnScroll.refresh).toBeDefined();
  });

  it('Each element in reveal array should have "classList" property', async () => {
    revealOnScroll.elements.forEach((element) =>
      expect(element.classList).toBeDefined()
    );
  });

  it('Each element in reveal array should have "getBoundingClientRect" property', async () => {
    revealOnScroll.elements.forEach((element) =>
      expect(element.getBoundingClientRect).toBeDefined()
    );
  });

  it("Should reveal all elements if `intersectionObserver` isn't available", async () => {
    revealOnScroll.elements.forEach((element) => {
      expect(element.classList.contains(VISIBLE_CLASS)).toBe(true);
    });
  });

  it("Should only reveal elements if within viewport and not reveal-hidden", async () => {});

  it("Should reveal elements if within viewport after reveal-hidden is removed", async () => {});

  it("Should only reveal element if past threshold", async () => {});
});
