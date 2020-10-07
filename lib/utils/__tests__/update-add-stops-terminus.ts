import {expect} from '@jest/globals'
import * as reroute from '../update-add-stops-terminus'

const newStop = {
  stop_lon: -70,
  stop_lat: 40,
  stop_id: 'newStopId',
  stop_name: 'Stop name'
}

const newStopId = `feedId:${newStop.stop_id}`

describe('Utils > Reroute', () => {
  describe('segmentsFromStop', () => {
    it('should handle empty segments', () => {
      const segments = reroute.segmentsFromStop(newStop, [], newStopId)
      expect(segments).toHaveLength(1)
      expect(segments[0].geometry.type).toBe('Point')
      expect(segments[0].fromStopId).toBe(newStopId)
      expect(segments[0].toStopId).toBe(newStopId)
      expect(segments[0].geometry.coordinates[0]).toBe(newStop.stop_lon)
      expect(segments[0].geometry.coordinates[1]).toBe(newStop.stop_lat)
    })
  })

  describe('segmentsToStop', () => {
    it('should handle empty segments', () => {
      const segments = reroute.segmentsToStop(newStop, [], newStopId)
      expect(segments).toHaveLength(1)
      expect(segments[0].geometry.type).toBe('Point')
      expect(segments[0].fromStopId).toBe(newStopId)
      expect(segments[0].toStopId).toBe(newStopId)
      expect(segments[0].geometry.coordinates[0]).toBe(newStop.stop_lon)
      expect(segments[0].geometry.coordinates[1]).toBe(newStop.stop_lat)
    })

    it('should handle one point', () => {
      const segments = reroute.segmentsToStop(
        newStop,
        [
          reroute.stopToPoint(
            [newStop.stop_lon, newStop.stop_lat],
            newStop.stop_id
          )
        ],
        newStopId
      )
      expect(segments).toHaveLength(1)
      expect(segments[0].geometry.type).toBe('LineString')
      expect(segments[0].fromStopId).toBe(newStop.stop_id)
      expect(segments[0].toStopId).toBe(newStopId)
      expect(segments[0].geometry.coordinates).toHaveLength(2)
      expect(segments[0].geometry.coordinates[0]).toHaveLength(2)
    })
  })
})
