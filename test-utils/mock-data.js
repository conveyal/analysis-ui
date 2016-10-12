const mockRoute = {
  patterns: [
    {
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            -122.0246,
            36.9707
          ],
          [
            -122.0279,
            37.049
          ],
          [
            -121.9799,
            37.2299
          ],
          [
            -121.9445,
            37.324
          ],
          [
            -121.936,
            37.353
          ],
          [
            -121.924,
            37.365
          ]
        ]
      },
      stops: [],
      trips: [
        {
          trip_id: 'abcd',
          start_time: 12345,
          trip_short_name: 'The Express',
          trip_headsign: 'To Downtown',
          duration: 1234
        }
      ]
    }
  ]
}

export const mockFeed = {
  routes: [mockRoute],
  routesById: {
    route1: mockRoute
  }
}

export const mockMapState = {
  allowExtend: true,
  extendFromEnd: true,
  followRoad: true,
  state: 'add-trip-pattern',
  modificationId: '1234'
}

export const mockTimetable = {
  name: 'Test timetable',
  speed: 40,
  dwellTime: 10,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
  headwaySecs: 900, // 15 minutes
  startTime: 28800, // 8am
  endTime: 57600, // 4pm
  patternTrips: ['abcd'],
  sourceTrip: 'abcd'
}

export const mockModification = {
  bidirectional: false,
  entries: [],
  feed: '1',
  id: '1234',
  name: 'Test Modification',
  routes: ['route1'],
  segments: [],
  showOnMap: false,
  timetables: [mockTimetable],
  trips: ['abcd']
}
