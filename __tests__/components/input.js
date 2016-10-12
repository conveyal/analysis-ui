/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import { Checkbox, File, Group, Input, Number, Select, SelectMultiple, Text } from '../../lib/components/input'

describe('Component > Checkbox', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Checkbox
        label='Do the thing?'
        checked
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})

describe('Component > File', () => {
  it('renders correctly', () => {
    const tree = mount(
      <File
        label='Select files'
        multiple
        name='files'
        value={undefined}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})

describe('Component > Group', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Group />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})

describe('Component > Input', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Input
        name='someInput'
        placeholder='Enter Text'
        value=''
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})

describe('Component > Number', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Number
        name='someNumber'
        placeholder='Enter Number'
        value={12345}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})

describe('Component > Select', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Select
        label='Select an option'
        value=''
        >
        <option key='1' value='1'>1</option>
        <option key='2' value='2'>2</option>
      </Select>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})

describe('Component > SelectMultiple', () => {
  it('renders correctly', () => {
    const tree = mount(
      <SelectMultiple
        label='Select multiple options'
        value=''
        >
        <option key='1' value='1'>1</option>
        <option key='2' value='2'>2</option>
      </SelectMultiple>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})

describe('Component > Text', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Text
        label='Enter text'
        name='someText'
        value='blah'
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
