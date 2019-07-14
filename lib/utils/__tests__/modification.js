//
import toStartCase from 'lodash/startCase'

import {MODIFICATION_TYPES} from '../../constants'
import {
  create,
  formatForServer,
  isValid,
  validateSegments
} from '../modification'
import {mockModification} from '../mock-data'

describe('Utils > Modification', () => {
  describe('create', () => {
    MODIFICATION_TYPES.forEach(t => {
      it(`should create a modification of type ${t}`, () => {
        const m = create({type: t, projectId: '1', variants: []})
        expect(m.type).toBe(t)
        expect(m.name).toBe(toStartCase(t))
      })
    })
  })

  describe('formatForServer', () => {
    it('should convert feed, routes, stops, and trips to their ids', () => {
      const formatted = formatForServer({
        ...mockModification,
        feed: {id: 'feed1'},
        stops: [{id: 'stop1'}]
      })
      expect(typeof formatted.routes[0]).toBe('string')
      expect(typeof formatted.stops[0]).toBe('string')
      expect(typeof formatted.trips[0]).toBe('string')
      expect(typeof formatted.feed).toBe('string')
    })
  })

  describe('validateSegments', () => {
    it('should return void for valid segments and an error string for invalid ones', () => {
      expect(validateSegments(mockModification.segments)).toBeUndefined()
      expect(
        validateSegments([
          {
            ...mockModification.segments[0],
            geometry: {
              type: 'Point'
            }
          }
        ])
      ).toBe('Expected lineString geometry, got Point')
    })
  })

  describe('isValid', () => {
    it('should throw an error invalid segments', () => {
      const willThrow = () =>
        isValid({
          ...mockModification,
          segments: [
            ...mockModification.segments,
            {
              ...mockModification.segments[0],
              stopAtStart: true
            }
          ]
        })
      expect(willThrow).toThrowErrorMatchingSnapshot()
    })
  })
})
