module.exports = {
  transform: {
    "^.+\\.svelte$": "svelte-jester",
    "^.+\\.svg$": "jest-svg-transformer",
    "^.+\\.js$": "babel-jest",
  },
  setupFiles: ["core-js"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleFileExtensions: ["js", "svelte"],
};
