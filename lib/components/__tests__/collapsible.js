import React from 'react'
import {mount} from 'enzyme'

import Collapsible from '../collapsible'

test('Component > Collapsible', () => {
  const tree = mount(
    <Collapsible title='collapse'>
      <div id='Text'>Lorem ipsum dolor sit amet.</div>
    </Collapsible>
  )

  // Text should not exist
  expect(tree.exists('#Text')).toBe(false)

  // Text should exist after click
  const button = tree.find('a')
  button.simulate('click')
  expect(tree.exists('#Text')).toBe(true)

  // Take snapshot of fully expanded component
  expect(tree).toMatchSnapshot()

  // Text should no longer exist after a second click
  button.simulate('click')
  expect(tree.exists('#Text')).toBe(false)

  // Unmount without errors
  tree.unmount()

  // Test defaultExpanded
  const defExpanded = mount(
    <Collapsible defaultExpanded>
      <div id='test' />
    </Collapsible>
  )
  expect(defExpanded.exists('#test')).toBe(true)
})
