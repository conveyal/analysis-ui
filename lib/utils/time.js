
const pad0 = (_) => _ > 10 ? _ : `0${_}`

/** Convert seconds since noon - 12h to HH:MM format, discarding fractional components */
export function secondsToHhMmString (secs) {
  // end time may be past midnight, move it back
  secs = secs % (60 * 60 * 24)
  const mins = Math.round(secs / 60)
  const hrs = Math.floor(mins / 60)
  const remainderMins = mins % 60
  return `${pad0(hrs)}:${pad0(remainderMins)}`
}

export function hhMmStringToSeconds (hhmm) {
  return hhmm.split(':')
    .map((_) => parseInt(_))
    .reduce((hours, minutes) => hours * 3600 + minutes * 60)
}

export function secondsToMmSsString (secs) {
  return `${pad0(parseInt(secs / 60))}:${pad0(secs % 60)}`
}

export function mmSsStringToSeconds (mmss) {
  return mmss.split(':')
    .map((_) => parseInt(_))
    .reduce((minutes, seconds) => minutes * 60 + seconds)
}
