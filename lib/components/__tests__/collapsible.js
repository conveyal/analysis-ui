/* global describe, it, expect */

describe('Component > Collapsible', () => {
  const React = require('react')
  const Collapsible = require('../collapsible')
  const {mount} = require('enzyme')
  const {mountToJson} = require('enzyme-to-json')

  it('renders correctly', () => {
    const tree = mount(
      <Collapsible title='collapse'>
        <div>Lorem ipsum dolor sit amet.</div>
      </Collapsible>
    )

    expect(mountToJson(tree)).toMatchSnapshot()
  })

  it('expands correctly', () => {
    const tree = mount(
      <Collapsible title='collapse'>
        <div>Lorem ipsum dolor sit amet.</div>
      </Collapsible>
    )

    tree.find('div > .CollapsibleButton').simulate('click')

    expect(mountToJson(tree)).toMatchSnapshot()
  })

  it('collapses correctly', () => {
    const tree = mount(
      <Collapsible title='collapse' defaultExpanded>
        <div>Lorem ipsum dolor sit amet.</div>
      </Collapsible>
    )

    tree.find('div > .CollapsibleButton').simulate('click')

    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
