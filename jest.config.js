// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^types/(.*)": "<rootDir>/types/$1",
    "^utils/(.*)": "<rootDir>/utils/$1",
  },
  testMatch: ["**/*.spec.(js|jsx|ts|tsx)"],
  transformIgnorePatterns: ["/node_modules/(?!escape-string-regexp)"],
};
