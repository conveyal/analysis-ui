// Set the `API_URL`
process.env.NEXT_PUBLIC_API_URL = 'http://localhost'

module.exports = {
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/css-import.js',
    '\\.png$': '<rootDir>/__mocks__/png-import.js'
  },
  // Add the current working directory to the path to allow absolute imports from /lib
  modulePaths: ['.'],
  notify: false,
  setupFiles: ['./jest/enzyme', './jest/fetch'],
  snapshotSerializers: [
    './jest/geojson-snapshot-serializer',
    'enzyme-to-json/serializer'
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/']
}
