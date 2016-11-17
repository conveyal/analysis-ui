/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import { Body, Heading, Panel } from '../panel'

describe('Component > Panel', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Panel>Panel text</Panel>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})

describe('Component > Heading', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Heading>Heading text</Heading>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})

describe('Component > Body', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Body>Body text</Body>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
