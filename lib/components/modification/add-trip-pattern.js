/** display an add trip pattern modification */

import React, {PropTypes} from 'react'

import DeepEqual from '../deep-equal'

import EditAlignment from './edit-alignment'
import Timetables from './timetables'

export default class AddTripPattern extends DeepEqual {
  static propTypes = {
    extendFromEnd: PropTypes.bool.isRequired,
    mapState: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    numberOfStops: PropTypes.number.isRequired,
    segmentDistances: PropTypes.array.isRequired,

    // actions
    setMapState: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  render () {
    const {
      extendFromEnd,
      mapState,
      modification,
      numberOfStops,
      segmentDistances,
      setMapState,
      update
    } = this.props

    return (
      <div>
        <EditAlignment
          extendFromEnd={extendFromEnd}
          mapState={mapState}
          modification={modification}
          setMapState={setMapState}
          update={update}
          />

        <Timetables
          numberOfStops={numberOfStops}
          segmentDistances={segmentDistances}
          timetables={modification.timetables}
          update={update}
          />
      </div>
    )
  }
}
