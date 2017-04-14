/* global describe, it, expect, jest */

describe('Component > Buttons', () => {
  const { mount } = require('enzyme')
  const { mountToJson } = require('enzyme-to-json')
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

    it('radio buttons work', () => {
      const fns = [jest.fn(), jest.fn(), jest.fn()]

      const tree = mount(<Group radio>
        <Button radio name='radio' value='WHUR' onChange={fns[0]}>WHUR</Button>
        <Button radio name='radio' value='WETA' onChange={fns[1]} checked>WETA</Button>
        <Button radio name='radio' value='WTOP' onChange={fns[2]}>WTOP</Button>
      </Group>)

      expect(mountToJson(tree)).toMatchSnapshot() // WETA should be selected

      // click a button. The inputs themselves are hidden, so clicks on the labels should
      // trigger the change
      tree.find('label').first().simulate('click') // select WHUR

      expect(fns[0]).toHaveBeenCalled()
      expect(fns[0].mock.calls[0][0].target.value).toBeTruthy() // toggled on
      expect(fns[1]).toHaveBeenCalled()
      expect(fns[1].mock.calls[0][0].taget.value).toBeFalsy() // toggled off
      expect(fns[2]).not.toHaveBeenCalled()
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
