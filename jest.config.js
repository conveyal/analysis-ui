module.exports = {
  moduleDirectories: ['node_modules', 'lib'],
  setupFiles: ['./lib/utils/enzyme'],
  snapshotSerializers: [
    './lib/utils/geojson-snapshot-serializer',
    'enzyme-to-json/serializer'
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/']
}
