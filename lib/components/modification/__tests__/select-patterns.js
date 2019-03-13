// @flow
import enzyme from 'enzyme'
import React from 'react'

import SelectPatterns from '../select-patterns'
import {mockPattern} from '../../../utils/mock-data'

describe('Component > SelectPatterns', () => {
  it('renders correctly', () => {
    const onChangeFn = jest.fn()
    const tree = enzyme.shallow(
      <SelectPatterns
        onChange={onChangeFn}
        routePatterns={[mockPattern]}
        trips={null}
      />
    )
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toHaveBeenCalled()
    tree.unmount()
  })
})
