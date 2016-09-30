/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import SelectStops from '../../lib/components/select-stops'

describe('SelectStops', () => {
  it('renders correctly with no feed data', () => {
    const replaceModificationFn = jest.fn()
    const setMapStateFn = jest.fn()
    const tree = renderer.create(
      <SelectStops
        modification={{}}
        replaceModification={replaceModificationFn}
        setMapState={setMapStateFn}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(replaceModificationFn).not.toBeCalled()
    expect(setMapStateFn).not.toBeCalled()
  })
})
