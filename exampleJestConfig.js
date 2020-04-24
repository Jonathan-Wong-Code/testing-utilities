const COVERAGE = 70;

module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!src/**/*.mock.{js,jsx}", // exclude all files with mock.
    "!src/client/**/*.{js,jsx}",
    "!src/common/tests/**/*.{js,jsx}",
    "!src/server/**/*.{js,jsx}",
    "!src/common/theme/**/*.{js,jsx}",
    "!src/common/containers/data/**/*.{js,jsx}",
    "!src/common/reducers.js",
    "!src/common/configureStore.js",
    "!src/common/containers/app/**/*.{js,jsx}",
    "!src/common/components/globalStyles/**/*.{js,jsx}",
    "!src/index.js",
  ],

  coverageThreshold: {
    global: {
      statements: COVERAGE,
      branches: COVERAGE,
      functions: COVERAGE,
      lines: COVERAGE,
    },
  },

  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    ".*\\.(css|less|styl|scss|sass)$":
      "<rootDir>/src/common/tests/mocks/cssModule.js",
    ".*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/common/tests/mocks/image.js",
  },
  setupFilesAfterEnv: ["<rootDir>/src/common/tests/setupTests.js"], // run this file before tests run.
  testRegex: "tests/.*\\.test\\.js$", // look in these folders for test files.
  snapshotSerializers: [],
};
