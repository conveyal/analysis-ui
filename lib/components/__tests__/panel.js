/* global describe, it, expect */

describe('Component > Panel', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const {Body, Heading, Panel} = require('../panel')

  describe('Panel', () => {
    it('renders correctly', () => {
      const tree = renderer.create(<Panel>Panel text</Panel>).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('Heading', () => {
    it('renders correctly', () => {
      const tree = renderer.create(<Heading>Heading text</Heading>).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('Body', () => {
    it('renders correctly', () => {
      const tree = renderer.create(<Body>Body text</Body>).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
