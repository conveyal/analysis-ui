import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {create as createModification} from './actions/modifications'
import DeepEqualComponent from './components/deep-equal'
import * as types from './utils/modification-types'
import ModificationGroup from './modification-group'
import VariantEditor from './variant-editor'

function mapStateToProps (state, props) {
  const defaultFeedId = state.scenario.feeds.length > 0
    ? state.scenario.feeds[0].id
    : ''

  return {
    defaultFeedId,
    modificationsByType: state.scenario.modificationsByType,
    scenarioId: props.params.scenarioId,
    variants: state.scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createModification: (opts) => dispatch(createModification(opts))
  }
}

class Modifications extends DeepEqualComponent {
  static propTypes = {
    createModification: PropTypes.func.isRequired,
    defaultFeedId: PropTypes.string.isRequired,
    modificationsByType: PropTypes.object.isRequired,
    scenarioId: PropTypes.string.isRequired,
    variants: PropTypes.array.isRequired
  }

  _createFns = {}

  createModificationBy (type) {
    if (!this._createFns[type]) {
      this._createFns[type] = () => this.createModification(type)
    }
    return this._createFns[type]
  }

  createModification (type) {
    const {createModification, defaultFeedId, scenarioId, variants} = this.props
    createModification({
      feedId: defaultFeedId,
      scenarioId,
      type,
      variants: variants.map((v) => true)
    })
  }

  render () {
    const {modificationsByType} = this.props

    return (
      <div>
        <VariantEditor />

        {modificationsByType && Object.values(types).map((type) => {
          return <ModificationGroup
            create={this.createModificationBy(type)}
            key={`modification-group-${type}`}
            modifications={modificationsByType[type] || []}
            type={type}
            />
        })}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modifications)
