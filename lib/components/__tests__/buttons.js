/* global describe, it, expect */

describe('Component > Buttons', () => {
  const React = require('react')
  const renderer = require('react-test-renderer')
  const { Group, Button } = require('../buttons')

  describe('Button', () => {
    it('renders correctly', () => {
      const tree = renderer.create(
        <Button
          style='fabulous'
          block
          size='sm'
          className='some-class'
          target='_blank'
          />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('Group', () => {
    it('renders correctly', () => {
      const tree = renderer.create(
        <Group justified />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
