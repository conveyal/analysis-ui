/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { Body, Heading, Panel } from '../../lib/components/panel'

describe('Component > Panel', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Panel>Panel text</Panel>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Component > Heading', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Heading>Heading text</Heading>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Component > Body', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Body>Body text</Body>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
