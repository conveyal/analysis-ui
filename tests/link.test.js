import React from 'react'
import renderer from 'react-test-renderer'

import Icon from '../lib/components/icon'

it('renders correctly', () => {
  const tree = renderer.create(
    <Icon />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
