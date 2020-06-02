import get from 'lodash/get'

export default function (s) {
  return get(s, 'analysis.maxTripDurationMinutes', 60)
}
