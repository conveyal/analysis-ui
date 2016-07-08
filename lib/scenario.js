/** display a scenario */

import React, {Component, PropTypes} from 'react'
import toSentenceCase from 'to-sentence-case'

import {create as createModification} from './utils/modification'
import * as types from './utils/modification-types'
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
    const create = (type) => () => {
      replaceModification(createModification({
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

        {Object.keys(types).map((key) =>
          <ModificationGroup
            create={create(types[key])}
            key={`modification-group-${key}`}
            modifications={modifications.filter(byType(types[key]))}
            scenarioProps={scenarioProps}
            title={toSentenceCase(types[key])}
            />
        )}
      </div>
    )
  }
}

export default Scenario
