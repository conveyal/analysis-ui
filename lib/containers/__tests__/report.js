//
import toJSON from 'enzyme-to-json'
import nock from 'nock'
import React from 'react'

import {mockRegion, mockProject, mockWithProvider} from '../../utils/mock-data'
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

    const {store, wrapper} = mockWithProvider(
      <Report
        params={{
          regionId: mockRegion._id,
          projectId: mockProject._id,
          variantId: '0'
        }}
      />
    )

    // assert that application was rendered
    const report = wrapper.find('Report').children()
    expect(toJSON(report, {mode: 'shallow'})).toMatchSnapshot()

    // ensure that actions were dispatched to load region
    expect(store.getActions().length).toBeGreaterThan(0)
    wrapper.unmount()
  })
})
