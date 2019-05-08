//
import nock from 'nock'
import React from 'react'

import EditRegion from '../edit-region'
import {mockRegion, mockWithProvider} from '../../utils/mock-data'

describe('Container > Edit Region', () => {
  it('renders correctly', done => {
    const postNock = nock('http://mockhost.com')
      .put(`/api/region/${mockRegion._id}`)
      .reply(200)

    // mount component
    const {wrapper} = mockWithProvider(<EditRegion params={{}} />)

    wrapper
      .find('input[name="Region Name"]')
      .simulate('change', {target: {value: 'New Region Name'}})

    wrapper.find('a[name="Save changes"]').simulate('click')

    setTimeout(() => {
      expect(postNock.isDone()).toBeTruthy()
      wrapper.unmount()
      done()
    }, 0)
  })
})
