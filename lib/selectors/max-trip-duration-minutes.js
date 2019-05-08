//
import get from '../utils/get'

export default function(state) {
  return get(state, 'analysis.profileRequest.maxTripDurationMinutes', 60)
}
