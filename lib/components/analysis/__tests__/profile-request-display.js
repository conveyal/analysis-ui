/* global describe, expect, it */

import React from 'react'
import ProfileRequestDisplay from '../profile-request-display'
import renderer from 'react-test-renderer'

const mockProfileRequest = {
  date: '2016-01-16',
  fromTime: 25200,
  toTime: 32400,
  accessModes: 'WALK',
  directModes: 'WALK',
  egressModes: 'WALK',
  transitModes: 'TRANSIT',
  walkSpeed: 1.3888888888888888,
  bikeSpeed: 4.166666666666667,
  carSpeed: 20,
  streetTime: 90,
  maxWalkTime: 20,
  maxBikeTime: 20,
  maxCarTime: 45,
  minBikeTime: 10,
  minCarTime: 10,
  suboptimalMinutes: 5,
  reachabilityThreshold: 0,
  bikeSafe: 1,
  bikeSlope: 1,
  bikeTime: 1,
  bikeTrafficStress: 4,
  monteCarloDraws: 200,
  maxRides: 4
}

describe('Components > Analysis > Profile Request Display', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<ProfileRequestDisplay request={mockProfileRequest} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
