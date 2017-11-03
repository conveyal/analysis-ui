// @flow

const {describe, expect, it} = global
describe('Container > Edit Project', () => {
  const nock = require('nock')
  const React = require('react')
  const {mockWithProvider} = require('../../utils/mock-data')

  it('renders correctly', done => {
    const EditProject = require('../edit-project')

    const postNock = nock('http://mockhost.com').post(`/api/project`).reply(200)

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
