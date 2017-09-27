/* global describe, expect, it, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import {mockRegionalAnalyses} from '../../../utils/mock-data'
import Regional from '../regional-analysis-selector'

describe('Components > Analysis > Regional Analysis Selector', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Regional allAnalyses={mockRegionalAnalyses} goToAnalysis={jest.fn()} />
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
