import {faPlus} from '@fortawesome/free-solid-svg-icons'
import enzyme from 'enzyme'
import React from 'react'

import Icon from '../icon'

test('Icon should render and match snapshot', () => {
  expect(enzyme.shallow(<Icon icon={faPlus} />)).toMatchSnapshot()
})
