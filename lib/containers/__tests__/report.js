// @flow
import nock from 'nock'
import React from 'react'

import {
  mockProject,
  mockScenario,
  mockWithProvider
} from '../../utils/mock-data'
import Report from '../report'

const {describe, expect, it} = global
describe('Container > Report', () => {
  it('renders correctly', () => {
    // ensure that /api/project is called during first load
    nock('http://mockHost.com/')
      .get('/api/project/1')
      .reply(200, mockProject)
      .get('/api/scenario/1')
      .reply(200, mockScenario)
      .get('/api/scenario/1/modifications')
      .reply(200)

    const {snapshot, store} = mockWithProvider(<Report params={{
      projectId: mockProject._id,
      scenarioId: mockScenario._id,
      variantId: '0'
    }} />)

    // assert that application was rendered
    expect(snapshot()).toMatchSnapshot()

    // ensure that actions were dispatched to load project
    expect(store.getActions().length).toBeGreaterThan(0)
  })
})
