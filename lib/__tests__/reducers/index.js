/* globals describe, expect, it */

import rootReducer from '../../lib/reducers'

describe('reducers > root', () => {
  it('should have default state', () => {
    expect(rootReducer(undefined, { type: 'blah', payload: {} })).toMatchSnapshot()
  })
})
