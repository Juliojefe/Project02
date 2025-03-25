// frontend/jest.config.js
module.exports = {
    preset: "react-native",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
};
