/**
 * @type {jest.ProjectConfig}
 */
module.exports = {
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.test.json",
    },
  },
};
