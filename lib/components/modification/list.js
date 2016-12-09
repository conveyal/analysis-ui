import React, {PropTypes} from 'react'

import DeepEqualComponent from '../deep-equal'
import Icon from '../icon'
import * as types from '../../utils/modification-types'
import ModificationGroup from './group'
import VariantEditor from '../../containers/variant-editor'

export default class ModificationsList extends DeepEqualComponent {
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

  state = {
    showAll: true
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

  _toggleShowAll = () => {
    this.setState({
      ...this.state,
      showAll: !this.state.showAll
    })
  }

  render () {
    const {activeModification, modificationsByType, projectId, scenarioId} = this.props
    const {showAll} = this.state

    return (
      <div>
        <VariantEditor />

        <div
          className='ModificationGroupTitle'
          onClick={this._toggleShowAll}
          >
          <Icon type={showAll ? 'minus-square-o' : 'plus-square-o'} />
          <span> Modifications</span>
        </div>

        {modificationsByType && Object.values(types).map((type) => {
          if (typeof type !== 'string') return
          return <ModificationGroup
            activeModification={activeModification}
            create={this._createModificationBy(type)}
            expanded={showAll}
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
