// @flow
import {shallow} from 'enzyme'
import toJSON from 'enzyme-to-json'
import React from 'react'

import DirectionIcon from '../direction-icon'

describe('Component > DirectionIcon', () => {
  it('renders correctly', () => {
    const tree = shallow(
      <DirectionIcon
        bearing={123}
        clickable
        color='blue'
        coordinates={[12, 34]}
        iconSize={20}
      />
    )
    expect(toJSON(tree)).toMatchSnapshot()
  })
})
