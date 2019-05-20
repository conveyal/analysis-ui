module.exports = {
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/css-import.js'
  },
  // Add the current working directory to the path to allow absolute imports from /lib
  modulePaths: ['.'],
  setupFiles: ['./lib/utils/enzyme'],
  snapshotSerializers: [
    './lib/utils/geojson-snapshot-serializer',
    'enzyme-to-json/serializer'
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/']
}
