/** display a scenario */

import React, {Component, PropTypes} from 'react'

import * as modification from './utils/modification'
import ModificationGroup from './modification-group'
import VariantEditor from './variant-editor'

class Scenario extends Component {
  static propTypes = {
    createVariant: PropTypes.func.isRequired,
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    modifications: PropTypes.array.isRequired,
    updateVariant: PropTypes.func.isRequired,
    bundleId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    deleteModification: PropTypes.func.isRequired,
    setActiveModification: PropTypes.func.isRequired,
    setActiveTrips: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired,
    name: PropTypes.string,
    projectName: PropTypes.string.isRequired,
    mapState: PropTypes.object.isRequired,
    scenarioId: PropTypes.string.isRequired
  }

  render () {
    const {feeds, modifications, replaceModification, scenarioId, variants} = this.props
    const byType = (type) => (modification) => modification.type === type
    const create = (type) => {
      replaceModification(modification.create({
        feedId: feeds[0].id,
        scenarioId,
        type,
        variants: variants.map((v) => true)
      }))
    }
    const scenarioProps = {...this.props}

    return (
      <div>
        <VariantEditor />

        <ModificationGroup
          create={create}
          modifications={modifications.filter(byType(modification.ADD_STOPS))}
          scenarioProps={scenarioProps}
          type={modification.ADD_STOPS}
          />
        <ModificationGroup
          create={create}
          modifications={modifications.filter(byType(modification.ADD_TRIP_PATTERN))}
          scenarioProps={scenarioProps}
          type={modification.ADD_TRIP_PATTERN}
          />
        <ModificationGroup
          create={create}
          modifications={modifications.filter(byType(modification.ADJUST_DWELL_TIME))}
          scenarioProps={scenarioProps}
          type={modification.ADJUST_DWELL_TIME}
          />
        <ModificationGroup
          create={create}
          modifications={modifications.filter(byType(modification.ADJUST_SPEED))}
          scenarioProps={scenarioProps}
          type={modification.ADJUST_SPEED}
          />
        <ModificationGroup
          create={create}
          modifications={modifications.filter(byType(modification.CONVERT_TO_FREQUENCY))}
          scenarioProps={scenarioProps}
          type={modification.CONVERT_TO_FREQUENCY}
          />
        <ModificationGroup
          create={create}
          modifications={modifications.filter(byType(modification.REMOVE_STOPS))}
          scenarioProps={scenarioProps}
          type={modification.REMOVE_STOPS}
          />
        <ModificationGroup
          create={create}
          modifications={modifications.filter(byType(modification.REMOVE_TRIPS))}
          scenarioProps={scenarioProps}
          type={modification.REMOVE_TRIPS}
          />
      </div>
    )
  }
}

export default Scenario
