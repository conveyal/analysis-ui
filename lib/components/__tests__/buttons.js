/* global describe, it, expect, jest */

describe('Component > Buttons', () => {
  const { mount } = require('enzyme')
  const { mountToJson } = require('enzyme-to-json')
  const React = require('react')
  const renderer = require('react-test-renderer')
  const {Button, Group, RadioButton} = require('../buttons')

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

    it('radio buttons work', () => {
      const fns = [jest.fn(), jest.fn(), jest.fn()]
      const tree = mount(<Group>
        <RadioButton id='r0' name='radio-group' value='WHUR' onChange={fns[0]}>WHUR</RadioButton>
        <RadioButton id='r1' name='radio-group' value='WETA' onChange={fns[1]} checked>WETA</RadioButton>
        <RadioButton id='r2' name='radio-group' value='WTOP' onChange={fns[2]}>WTOP</RadioButton>
      </Group>)

      // click a button. The inputs themselves are hidden, so clicks on the labels should
      // trigger the change
      tree.find('#r0').simulate('change', {target: {checked: true}}) // .simulate('click') // select WHUR

      expect(fns[0]).toHaveBeenCalled()
      expect(fns[1]).not.toHaveBeenCalled()
      expect(fns[2]).not.toHaveBeenCalled()

      expect(mountToJson(tree)).toMatchSnapshot() // WHUR should be selected
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
