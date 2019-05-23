import {testComponent} from 'lib/utils/test'

import VariantEditor from '../variant-editor'

describe('Component > VariantEditor', () => {
  it('renders correctly', () => {
    const props = {
      variants: [],
      createVariant: jest.fn(),
      deleteVariant: jest.fn(),
      editVariantName: jest.fn(),
      showVariant: jest.fn()
    }

    // mount component
    const p = testComponent(VariantEditor, props)
    const tree = p.mount()
    expect(tree).toMatchSnapshot()
    const noCalls = [
      'createVariant',
      'deleteVariant',
      'editVariantName',
      'showVariant'
    ]
    noCalls.forEach(fn => {
      expect(props[fn]).not.toHaveBeenCalled()
    })
    tree.unmount()
  })
})
