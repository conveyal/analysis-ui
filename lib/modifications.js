import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {create as createModification, setAndRetrieveData} from './actions/modifications'
import DeepEqualComponent from './components/deep-equal'
import activeModificationSelector from './selectors/active-modification'
import * as types from './utils/modification-types'
import ModificationGroup from './modification-group'
import VariantEditor from './variant-editor'

function mapStateToProps (state, props) {
  const defaultFeedId = state.scenario.feeds.length > 0
    ? state.scenario.feeds[0].id
    : ''

  return {
    activeModification: activeModificationSelector(state, props),
    bundleId: state.scenario.currentBundle.id,
    defaultFeedId,
    modificationsByType: state.scenario.modificationsByType || {},
    projectId: props.params.projectId,
    scenarioId: props.params.scenarioId,
    variants: state.scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createModification: (opts) => dispatch(createModification(opts)),
    replaceModification: (opts) => dispatch(setAndRetrieveData(opts))
  }
}

class Modifications extends DeepEqualComponent {
  static propTypes = {
    activeModification: PropTypes.object,
    bundleId: PropTypes.string.isRequired,
    createModification: PropTypes.func.isRequired,
    defaultFeedId: PropTypes.string.isRequired,
    modificationsByType: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    scenarioId: PropTypes.string.isRequired,
    variants: PropTypes.array.isRequired
  }

  _createFns = {}

  _createModificationBy (type) {
    if (!this._createFns[type]) {
      this._createFns[type] = () => this._createModification(type)
    }
    return this._createFns[type]
  }

  _createModification (type) {
    const {createModification, defaultFeedId, projectId, scenarioId, variants} = this.props
    createModification({
      feedId: defaultFeedId,
      projectId,
      scenarioId,
      type,
      variants: variants.map((v) => true)
    })
  }

  _replaceModification = (modification) => {
    const {bundleId, replaceModification} = this.props
    replaceModification({
      bundleId,
      modification
    })
  }

  render () {
    const {activeModification, modificationsByType, projectId, scenarioId} = this.props

    return (
      <div>
        <VariantEditor />

        {modificationsByType && Object.values(types).map((type) => {
          return <ModificationGroup
            activeModification={activeModification}
            create={this._createModificationBy(type)}
            key={`modification-group-${type}`}
            modifications={modificationsByType[type] || []}
            projectId={projectId}
            replaceModification={this._replaceModification}
            scenarioId={scenarioId}
            type={type}
            />
        })}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modifications)
