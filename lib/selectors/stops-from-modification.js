import {createSelector} from 'reselect'

import selectSegments from './segments'
import getStops from '../utils/get-stops'

export default createSelector(selectSegments, segments => getStops(segments))
