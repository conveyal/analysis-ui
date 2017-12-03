// @flow
import nock from 'nock'
import React from 'react'

import {
  mockRegion,
  mockProject,
  mockWithProvider
} from '../../utils/mock-data'
import Report from '../report'

const {describe, expect, it} = global
describe('Container > Report', () => {
  it('renders correctly', () => {
    // ensure that /api/region is called during first load
    nock('http://mockHost.com/')
      .get('/api/region/1')
      .reply(200, mockRegion)
      .get('/api/project/1')
      .reply(200, mockProject)
      .get('/api/project/1/modifications')
      .reply(200)

    const {snapshot, store} = mockWithProvider(<Report params={{
      regionId: mockRegion._id,
      projectId: mockProject._id,
      variantId: '0'
    }} />)

    // assert that application was rendered
    expect(snapshot()).toMatchSnapshot()

    // ensure that actions were dispatched to load region
    expect(store.getActions().length).toBeGreaterThan(0)
  })
})
