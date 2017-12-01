/* global describe, it, expect, jest */

describe('Component > FrequencyEntry', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const {
    mockFeed,
    mockPattern,
    mockTimetable
  } = require('../../../utils/mock-data')
  const FrequencyEntry = require('../frequency-entry')

  it('renders correctly', () => {
    const replaceTimetableFn = jest.fn()
    const removeTimetableFn = jest.fn()
    const setActiveTripsFn = jest.fn()
    const tree = renderer
      .create(
        <FrequencyEntry
          allPhaseFromTimetableStops={{}}
          entry={mockTimetable}
          feed={mockFeed}
          modificationStops={[]}
          update={replaceTimetableFn}
          remove={removeTimetableFn}
          projectTimetables={[]}
          setActiveTrips={setActiveTripsFn}
          routes={['route1']}
          routePatterns={[mockPattern]}
          trip='abcd'
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(replaceTimetableFn).not.toBeCalled()
    expect(removeTimetableFn).not.toBeCalled()
    expect(setActiveTripsFn).not.toBeCalled()
  })
})
