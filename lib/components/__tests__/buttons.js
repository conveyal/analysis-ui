// @flow
import enzyme from 'enzyme'
import React from 'react'

import {Button, Group} from '../buttons'

describe('Component > Buttons', () => {
  describe('Button', () => {
    it('renders correctly', () => {
      const tree = enzyme.mount(
        <Button
          style='fabulous'
          block
          size='sm'
          className='some-class'
          target='_blank'
        />
      )
      expect(tree).toMatchSnapshot()
      tree.unmount()
    })
  })

  describe('Group', () => {
    it('renders correctly', () => {
      const tree = enzyme.mount(<Group justified />)
      expect(tree).toMatchSnapshot()
      tree.unmount()
    })
  })
})
