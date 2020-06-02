import get from 'lodash/get'

export default function (s) {
  return get(s, 'analysis.travelTimePercentile', 50)
}
