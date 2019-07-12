import enzyme from 'enzyme'
import React from 'react'

import {Collapsible, Body, Heading, Panel} from '../panel'

describe('Component > Panel', () => {
  describe('Panel', () => {
    it('renders correctly', () => {
      const tree = enzyme.mount(<Panel>Panel text</Panel>)
      expect(tree).toMatchSnapshot()
      tree.unmount()
    })
  })

  describe('Heading', () => {
    it('renders correctly', () => {
      const tree = enzyme.mount(<Heading>Heading text</Heading>)
      expect(tree).toMatchSnapshot()
      tree.unmount()
    })
  })

  describe('Body', () => {
    it('renders correctly', () => {
      const tree = enzyme.mount(<Body>Body text</Body>)
      expect(tree).toMatchSnapshot()
      tree.unmount()
    })
  })

  describe('Collapsible', () => {
    it('should expand / collapse correctly', () => {
      const tree = enzyme.mount(
        <Collapsible defaultExpanded={false} heading={() => 'Heading'}>
          <div id='body' />
        </Collapsible>
      )
      expect(tree.exists('#body')).toBe(false)
      tree.find('Heading').simulate('click')
      expect(tree.exists('#body')).toBe(true)
    })
  })
})
