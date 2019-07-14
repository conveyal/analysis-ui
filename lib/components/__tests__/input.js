import enzyme from 'enzyme'
import React from 'react'

import {Checkbox, File, Group, Input, NumberInput, Select, Text} from '../input'

function shallowTest(c) {
  const tree = enzyme.shallow(c)
  expect(tree).toMatchSnapshot()
  tree.unmount()
}

describe('Component > Input', () => {
  describe('Checkbox', () => {
    it('renders correctly', () => {
      shallowTest(<Checkbox label='Do the thing?' defaultChecked />)
    })
  })

  describe('File', () => {
    it('renders correctly', () => {
      shallowTest(<File label='s' multiple name='files' value={undefined} />)
    })
  })

  describe('Group', () => {
    it('renders correctly', () => {
      shallowTest(<Group />)
    })
  })

  describe('Input', () => {
    it('renders correctly', () => {
      shallowTest(<Input name='someInput' placeholder='Enter Text' value='' />)
    })
  })

  describe('Number', () => {
    it('renders correctly', () => {
      shallowTest(
        <NumberInput
          name='someNumber'
          placeholder='Enter Number'
          value={12345}
        />
      )
    })

    it('renders correctly with invalid min value', () => {
      const wrapper = enzyme.mount(
        <NumberInput name='someNumber2' placeholder='Enter Number' min={5} />
      )

      wrapper
        .find('input[name="someNumber2"]')
        .simulate('change', {currentTarget: {value: '-1'}})

      expect(wrapper).toMatchSnapshot()
      wrapper.unmount()
    })

    it('renders correctly with invalid max value', () => {
      const wrapper = enzyme.mount(
        <NumberInput name='someNumber3' placeholder='Enter Number' max={2} />
      )

      wrapper
        .find('input[name="someNumber3"]')
        .simulate('change', {currentTarget: {value: '3'}})

      expect(wrapper).toMatchSnapshot()
      wrapper.unmount()
    })
  })

  describe('Select', () => {
    it('renders correctly', () => {
      shallowTest(
        <Select label='Select an option' value=''>
          <option key='1' value='1'>
            1
          </option>
          <option key='2' value='2'>
            2
          </option>
        </Select>
      )
    })
  })

  describe('Text', () => {
    it('renders correctly', () => {
      shallowTest(<Text label='Enter text' name='someText' value='blah' />)
    })
  })
})
