import fs from "fs";
import path from "path";

import RevealOnScroll from "../src";

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

  it("Should be defined", async () => {
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
});
