
export function create (segmentSpeeds = []) {
  const timetable = {
    startTime: 7 * 3600,
    endTime: 22 * 3600,
    dwellTime: 0,
    segmentSpeeds,
    headwaySecs: 600,

    // active every day
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  }

  return timetable
}
