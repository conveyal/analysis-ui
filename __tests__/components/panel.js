/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import Panel, { Heading, Body } from '../../lib/components/panel'

describe('Panel', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Panel>Panel text</Panel>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Heading', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Heading>Heading text</Heading>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Body', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Body>Body text</Body>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
