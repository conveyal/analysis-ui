import enzyme from 'enzyme'
import {createRouter} from 'next/router'
import {RouterContext} from 'next-server/dist/lib/router-context'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from './mock-data'

const router = createRouter('page', {}, 'as-path', {})

export function testComponent(
  TestComponent,
  props = {},
  initialData = mockStores.init
) {
  const store = makeMockStore(initialData)
  const render = () => (
    <Provider store={store}>
      <RouterContext.Provider value={router}>
        <TestComponent {...props} />
      </RouterContext.Provider>
    </Provider>
  )

  const mount = () => enzyme.mount(render())

  // TODO: Dive down through the `TestComponent` automatically
  const shallow = () => enzyme.shallow(render())

  return {mount, render, router, shallow, store}
}

/**
 * Helper function to create quick snapshot tests for components.
 */
export function testAndSnapshot(C, p, id) {
  test(`[SNAP] Component > ${C.name}`, () => {
    const c = testComponent(C, p, id)
    const t = c.mount()
    expect(t).toMatchSnapshot()
    t.unmount()
  })
}
