import fs from "fs";
import path from "path";

import RevealOnScroll from "../src/ts/reveal-on-scroll";
import { getAllElementsToReveal } from "../src/ts/utils/helpers";

const FIXTURE_PATH = "./index.fixture.html";
const html = fs.readFileSync(path.resolve(__dirname, FIXTURE_PATH), "utf8");
jest.dontMock("fs");

describe("revealOnScroll()", function () {
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

  it("Should be defined", function () {
    const revealOnScroll = new RevealOnScroll();
    expect(revealOnScroll).toBeDefined();
  });
});
