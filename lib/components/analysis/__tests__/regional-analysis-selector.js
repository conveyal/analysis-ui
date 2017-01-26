/* global describe, expect, it, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import {mockRegionalAnalyses} from '../../../utils/mock-data'
import Regional from '../regional-analysis-selector'

describe('Components > Analysis > Regional Analysis Selector', () => {
  it('renders correctly', () => {
    const load = jest.fn()
    const select = jest.fn()

    const tree = renderer.create(
      <Regional
        loadRegionalAnalyses={load}
        projectId='5678'
        regionalAnalyses={mockRegionalAnalyses}
        scenarioId='1234'
        selectRegionalAnalysis={select}
        />
    ).toJSON()

    expect(load).toBeCalled()
    expect(select).not.toBeCalled()
    expect(tree).toMatchSnapshot()
  })
})
