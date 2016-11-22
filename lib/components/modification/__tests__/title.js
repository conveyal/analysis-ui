/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import { mockModification } from '../../../utils/mock-data'

import Title from '../title'

describe('Component > Modification > Scenario', () => {
  it('renders correctly', () => {
    const replaceModificationFn = jest.fn()
    const tree = mount(
      <Title
        active
        modification={mockModification}
        name='Title'
        projectId='1234'
        replaceModification={replaceModificationFn}
        scenarioId='1234'
        showOnMap
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(replaceModificationFn).not.toBeCalled()
  })
})
