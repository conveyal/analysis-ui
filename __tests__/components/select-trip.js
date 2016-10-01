/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockComponents } from '../../testUtils'

jest.mock('react-select', () => 'React-Select')
jest.mock('../../lib/components/input', () => { return mockComponents(['Group']) })

import SelectTrip from '../../lib/components/select-trip'

describe('SelectTrip', () => {
  it('renders correctly', () => {
    const patternTrips = ['abcd']
    const mockFeed = {
      routesById: {
        route1: {
          patterns: [
            {
              trips: [
                {
                  trip_id: 'abcd',
                  start_time: 12345,
                  trip_short_name: 'The Express',
                  trip_headsign: 'To Downtown',
                  duration: 1234
                }
              ]
            }
          ]
        }
      }
    }
    const onChangeFn = jest.fn()
    const routes = ['route1']
    const trip = 'abcd'
    const tree = renderer.create(
      <SelectTrip
        feed={mockFeed}
        onChange={onChangeFn}
        patternTrips={patternTrips}
        routes={routes}
        trip={trip}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })
})
