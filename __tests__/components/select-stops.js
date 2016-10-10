/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import SelectStops from '../../lib/components/select-stops'

describe('Component > SelectStops', () => {
  it('renders correctly with no feed data', () => {
    const replaceModificationFn = jest.fn()
    const setMapStateFn = jest.fn()
    const tree = mount(
      <SelectStops
        modification={{}}
        replaceModification={replaceModificationFn}
        setMapState={setMapStateFn}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(replaceModificationFn).not.toBeCalled()
    expect(setMapStateFn).not.toBeCalled()
  })
})
