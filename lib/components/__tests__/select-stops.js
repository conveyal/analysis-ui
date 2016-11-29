/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import SelectStops from '../select-stops'

describe('Component > SelectStops', () => {
  it('renders correctly with no feed data', () => {
    const update = jest.fn()
    const setMapStateFn = jest.fn()
    const tree = renderer.create(
      <SelectStops
        modification={{}}
        setMapState={setMapStateFn}
        update={update}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(update).not.toBeCalled()
    expect(setMapStateFn).not.toBeCalled()
  })
})
