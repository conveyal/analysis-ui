/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import SelectStops from '../../lib/components/select-stops'

describe('Component > SelectStops', () => {
  it('renders correctly with no feed data', () => {
    const update = jest.fn()
    const setMapStateFn = jest.fn()
    const tree = mount(
      <SelectStops
        modification={{}}
        setMapState={setMapStateFn}
        update={update}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(update).not.toBeCalled()
    expect(setMapStateFn).not.toBeCalled()
  })
})
