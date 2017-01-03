/* global describe, it, expect, jest */

describe('Component > EditBundle', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const CreateGrid = require('../create-grid')
  const { mount } = require('enzyme')
  const { mountToJson } = require('enzyme-to-json')

  it('renders correctly', () => {
    const tree = renderer.create(<CreateGrid
      projectId='PROJECT ID'
      finish={jest.fn()}
      />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  /** extra fields should appear when uploading a CSV */
  it('renders csv upload correctly', () => {
    const cg = <CreateGrid
      projectId='PROJECT ID'
      finish={jest.fn()}
      />

    const csvFile = { name: 'TEST.CSV' }

    const tree = mount(cg)

    tree.find('input[type="file"]').simulate('change', { target: { files: [csvFile] } })

    expect(mountToJson(tree)).toMatchSnapshot()
  })

  /** extra fields should not appear when uploading a shapefile */
  it('renders shapefile upload correctly', () => {
    const cg = <CreateGrid
      projectId='PROJECT ID'
      finish={jest.fn()}
      />

    const files = [
      { name: 'TEST.shp' },
      { name: 'TEST.shx' },
      { name: 'TEST.dbf' },
      { name: 'TEST.prj' }
    ]

    const tree = mount(cg)

    tree.find('input[type="file"]').simulate('change', { target: { files } })

    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
