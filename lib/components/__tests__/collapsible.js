//

import React from 'react'
import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'

import Collapsible from '../collapsible'

describe('Component > Collapsible', () => {
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
