// @flow
import {classifiers, colorizers} from '@conveyal/gridualizer'
import {createSelector} from 'reselect'

import colors from '../constants/colors'

export default createSelector(
  state => state.analysis.destinationGrid,
  grid => {
    const classifier = classifiers.diverging({scheme: classifiers.quantile})
    const breaks = classifier(grid, colors.REGIONAL_COMPARISON_GRADIENT.length)
    return colorizers.dot(colors.REGIONAL_COMPARISON_GRADIENT, breaks)
  }
)
