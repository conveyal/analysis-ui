// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import SelectTrip from '../select-trip'
import {mockFeed} from '../../../utils/mock-data'

describe('Component > SelectTrip', () => {
  it('renders correctly', () => {
    const patternTrips = ['abcd']
    const onChangeFn = jest.fn()
    const routes = ['route1']
    const trip = 'abcd'
    const tree = renderer
      .create(
        <SelectTrip
          feed={mockFeed}
          onChange={onChangeFn}
          patternTrips={patternTrips}
          routes={routes}
          trip={trip}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })
})
