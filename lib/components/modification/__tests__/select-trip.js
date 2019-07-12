//
import enzyme from 'enzyme'
import React from 'react'

import SelectTrip from '../select-trip'
import {mockFeed} from '../../../utils/mock-data'

describe('Component > SelectTrip', () => {
  it('renders correctly', () => {
    const patternTrips = ['abcd']
    const onChangeFn = jest.fn()
    const routes = ['route1']
    const trip = 'abcd'
    const tree = enzyme.shallow(
      <SelectTrip
        feed={mockFeed}
        onChange={onChangeFn}
        patternTrips={patternTrips}
        routes={routes}
        trip={trip}
      />
    )
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toHaveBeenCalled()
    tree.unmount()
  })
})
