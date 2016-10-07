/* globals afterEach, beforeEach, describe, expect, it, jasmine */

const exec = require('child_process').exec

import { auto } from 'async'
const fs = require('fs-extra')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

describe('build', function () {
  const buildFolder = 'test-build'
  const rmBuildFolderFn = (cb) => {
    rimraf(buildFolder, cb)
  }

  beforeEach((done) => {
    auto({
      removeBuildFolder: rmBuildFolderFn,
      makeBuildFolder: ['removeBuildFolder', (results, cb) => {
        mkdirp(buildFolder, cb)
      }],
      renameSettings: (cb) => {
        fs.copy('configurations/default/settings.yml',
          'configurations/default/settings.yml-original',
          cb)
      },
      mockSettings: ['renameSettings', (results, cb) => {
        fs.copy('testUtils/mock-settings.yml',
          'configurations/default/settings.yml',
          cb)
      }]
    }, done)
  })

  afterEach((done) => {
    auto({
      removeBuildFolder: rmBuildFolderFn,
      removeTestSettings: (cb) => {
        rimraf('configurations/default/settings.yml', cb)
      },
      restoreOriginalSettings: ['removeTestSettings', (results, cb) => {
        fs.move('configurations/default/settings.yml-original',
          'configurations/default/settings.yml',
          cb)
      }]
    }, done)
  })

  it('should build the project successfully', (done) => {
    exec(`node_modules/.bin/mastarm build lib/index.js:${buildFolder}/index.js lib/styles.css:${buildFolder}/index.css`,
      (err, stdout, stderr) => {
        expect(err).toBeNull()
        expect(stdout).toBe('')
        expect(stderr).toBe('')
        expect(fs.existsSync(`${buildFolder}/index.js`)).toBeTruthy()
        expect(fs.existsSync(`${buildFolder}/index.css`)).toBeTruthy()
        done()
      }
    )
  })
})
