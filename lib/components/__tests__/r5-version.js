/* global describe, it, expect, jest */

import {releaseVersions, allVersions} from '../../utils/mock-data'

describe('Component > R5Version', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const R5Version = require('../r5-version')

  it('renders correctly', () => {
    const props = {
      fetch: jest.fn(),
      label: 'Label',
      name: 'Name',
      value: 'v3.0.0',
      onChange: jest.fn(),
      allVersions,
      releaseVersions
    }

    // mount component
    const tree = renderer.create(<R5Version {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should show warning with out of date r5 version', () => {
    const props = {
      fetch: jest.fn(),
      label: 'Label',
      name: 'Name',
      value: 'v2.2.0',
      onChange: jest.fn(),
      allVersions,
      releaseVersions
    }

    // mount component
    const tree = renderer.create(<R5Version {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should show flask for non-release versions', () => {
    const props = {
      fetch: jest.fn(),
      label: 'Label',
      name: 'Name',
      value: 'v2.0.0-19-g589f32f',
      onChange: jest.fn(),
      allVersions,
      releaseVersions
    }

    // mount component
    const tree = renderer.create(<R5Version {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should show struck-out value for unknown/unsupported versions', () => {
    const props = {
      fetch: jest.fn(),
      label: 'Label',
      name: 'Name',
      value: 'v2.0.1992', // there never was such a version
      onChange: jest.fn(),
      allVersions,
      releaseVersions
    }

    // mount component
    const tree = renderer.create(<R5Version {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
