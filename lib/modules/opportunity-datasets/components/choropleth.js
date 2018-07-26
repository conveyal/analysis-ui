// @flow
import {colorizers} from '@conveyal/gridualizer'
import {connect} from 'react-redux'

import colors from '../../../constants/colors'

import Gridualizer from '../../../components/map/gridualizer'

import * as select from '../selectors'

function mapStateToProps (state, ownProps) {
  const grid = select.activeOpportunityDatasetGrid(state, ownProps)
  const breaks = select.breaks(state, ownProps)
  if (!grid || !breaks) return {}

  return {
    colorizer: colorizers.choropleth(breaks, colors.OPPORTUNITY_DATASET_GRADIENT),
    grid
  }
}

export default connect(mapStateToProps)(Gridualizer)
