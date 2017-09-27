/* global describe, expect, it, jest */
import React from 'react'
import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import {Provider} from 'react-redux'

import Analysis from '../single-point-analysis'
import {makeMockStore, mockStores} from '../../utils/mock-data'

describe('Components > Analysis > Single Point', function () {
  it('should render correctly', function () {
    const mockStore = makeMockStore(mockStores.init)
    const tree = mount(
      <Provider store={mockStore}>
        <Analysis params={{}} />
      </Provider>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
