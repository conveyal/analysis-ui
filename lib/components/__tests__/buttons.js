// @flow

import React from 'react'
import renderer from 'react-test-renderer'

import {Button, Group} from '../buttons'

describe('Component > Buttons', () => {
  describe('Button', () => {
    it('renders correctly', () => {
      const tree = renderer
        .create(
          <Button
            style='fabulous'
            block
            size='sm'
            className='some-class'
            target='_blank'
          />
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('Group', () => {
    it('renders correctly', () => {
      const tree = renderer.create(<Group justified />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
