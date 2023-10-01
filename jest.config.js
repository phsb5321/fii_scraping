module.exports = {
  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // The test environment that will be used for testing
  testEnvironment: "node",

  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/*.spec.ts"],

  // An array of file extensions your modules use
  moduleFileExtensions: ["ts", "js"],

  // Add an alias to import modules more easily
  // @ -> src
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
