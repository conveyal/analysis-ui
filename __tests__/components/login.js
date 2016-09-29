/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

let mockShowLockFn = jest.fn()
jest.mock('../../lib/utils/auth0', () => { return { lock: { show: () => { mockShowLockFn() } } } })

import Login from '../../lib/components/login'

describe('Login', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Login />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(mockShowLockFn).toBeCalled()
  })
})
