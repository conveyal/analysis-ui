// @flow
import nock from 'nock'
import React from 'react'

import EditProject from '../edit-project'
import {mockProject, mockWithProvider} from '../../utils/mock-data'

const {describe, expect, it} = global
describe('Container > Edit Project', () => {
  it('renders correctly', done => {
    const postNock = nock('http://mockhost.com').put(`/api/project/${mockProject._id}`).reply(200)

    // mount component
    const {snapshot, wrapper} = mockWithProvider(<EditProject params={{}} />)

    wrapper
      .find('input[name="Region Name"]')
      .simulate('change', {target: {value: 'New Project Name'}})

    expect(snapshot()).toMatchSnapshot()

    wrapper
      .find('a[name="Save changes"]')
      .simulate('click')

    setTimeout(() => {
      expect(postNock.isDone()).toBeTruthy()
      done()
    }, 0)
  })
})
