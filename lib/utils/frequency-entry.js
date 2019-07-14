import uuid from 'uuid'

export function create(count) {
  return {
    _id: uuid.v4(),
    name: `Frequency Entry ${count}`,
    sourceTrip: null,
    headwaySecs: 600,
    patternTrips: [],
    startTime: 7 * 3600,
    endTime: 22 * 3600,

    // active every day
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  }
}
