describe('Component > SelectRegion', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const SelectRegion = require('../select-region')

  it('renders correctly', () => {
    const clearCurrentRegion = jest.fn()
    const createFn = jest.fn()
    const mockRegions = [{_id: 1, name: 'P1'}, {_id: 2, name: 'P2'}]
    const pushFn = jest.fn()
    const loadAllRegions = jest.fn()
    const tree = renderer
      .create(
        <SelectRegion
          create={createFn}
          clearCurrentRegion={clearCurrentRegion}
          loadAllRegions={loadAllRegions}
          regions={mockRegions}
          push={pushFn}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(createFn).not.toBeCalled()
    expect(pushFn).not.toBeCalled()
    expect(loadAllRegions).toBeCalled()
    expect(clearCurrentRegion).toBeCalled()
  })
})
