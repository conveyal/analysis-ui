/* global describe, it, expect */

describe('Component > Icon', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const Login = require('../login')

  it('renders correctly', () => {
    const tree = renderer.create(
      <Login />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
