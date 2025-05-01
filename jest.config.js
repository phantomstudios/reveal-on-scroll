/**
 * @type {jest.ProjectConfig}
 */
module.exports = {
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {tsconfig: "tsconfig.test.json"}],
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
