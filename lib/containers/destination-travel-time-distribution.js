// @flow
import {connect} from 'react-redux'
import DestinationTravelTimeDistribution
  from '../components/map/destination-travel-time-distribution'
import {setDestination} from '../actions/analysis'
import {removeComponent} from '../actions/map'
import {DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT} from '../constants/map'
import * as select from '../selectors'

function mapStateToProps (state: any) {
  const {destination, isFetchingIsochrone} = state.analysis

  return {
    destination,
    isFetchingIsochrone,
    destinationTravelTimeDistribution: select.destinationTravelTimeDistribution(
      state
    ),
    comparisonDestinationTravelTimeDistribution: select.comparisonDestinationTravelTimeDistribution(
      state
    )
  }
}

function mapDispatchToProps (dispatch: any => void): any {
  return {
    remove: () =>
      dispatch(removeComponent(DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT)),
    setDestination: destination => dispatch(setDestination(destination))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  DestinationTravelTimeDistribution
)
