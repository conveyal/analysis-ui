export const mockFeed = {
  routesById: {
    route1: {
      patterns: [
        {
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
  id: '1234',
  name: 'Test Modification',
  segments: [],
  timetables: [mockTimetable],
  bidirectional: false,
  showOnMap: false
}
