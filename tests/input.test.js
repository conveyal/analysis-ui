/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { Checkbox, File, Group, Input, Number, Select, SelectMultiple, Text } from '../lib/components/input'

describe('Checkbox', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Checkbox
        label='Do the thing?'
        checked
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('File', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <File
        label='Select files'
        multiple
        name='files'
        value={undefined}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Group', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Group />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Input', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Input
        name='someInput'
        placeholder='Enter Text'
        value=''
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Number', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Number
        name='someNumber'
        placeholder='Enter Number'
        value={12345}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Select', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Select
        label='Select an option'
        value=''
        >
        <option key='1' value='1'>1</option>
        <option key='2' value='2'>2</option>
      </Select>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('SelectMultiple', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SelectMultiple
        label='Select multiple options'
        value=''
        >
        <option key='1' value='1'>1</option>
        <option key='2' value='2'>2</option>
      </SelectMultiple>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Text', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Text
        label='Enter text'
        name='someText'
        value='blah'
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
