// @flow

import React from 'react'
import renderer from 'react-test-renderer'

import ProfileRequestDisplay from '../profile-request-display'

const mockProfileRequest = {
  accessModes: 'WALK',
  date: '2016-01-16',
  directModes: 'WALK',
  fromTime: 25200,
  maxRides: 4,
  monteCarloDraws: 200,
  toTime: 32400,
  transitModes: 'TRANSIT',
  workerVersion: 'mock-worker-version',
  bundleId: '1',
  projectId: '1',
  regionId: '1'
}

describe('Components > Analysis > Profile Request Display', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(<ProfileRequestDisplay {...mockProfileRequest} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
