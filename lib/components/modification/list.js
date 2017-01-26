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
    push: PropTypes.func.isRequired,
    replaceModification: PropTypes.func.isRequired,
    scenarioId: PropTypes.string.isRequired,
    variants: PropTypes.array.isRequired
  }

  state = {
    showAllOnMap: true
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

  _toggleShowAllOnMap = () => {
    const {modifications} = this.props
    const showAllOnMap = !this.state.showAllOnMap
    this.setState({...this.state, showAllOnMap})
    modifications.forEach((m) => this._replaceModification({...m, showOnMap: showAllOnMap}))
  }

  _editModification = (modification) => {
    const {push, projectId, scenarioId} = this.props
    push(`/projects/${projectId}/scenarios/${scenarioId}/modifications/${modification.id}`)
  }

  render () {
    const {activeModification, modificationsByType, projectId, scenarioId} = this.props
    const {showAllOnMap} = this.state
    const showIcon = showAllOnMap ? 'eye' : 'eye-slash'

    return (
      <div>
        <VariantEditor />

        <div
          className='DockTitle'
          >Modifications:
          <a
            className={`ShowOnMap pull-right ${showAllOnMap ? 'active' : 'dim'} fa-btn`}
            onClick={this._toggleShowAllOnMap}
            title='Toggle all modifications map display'
            ><Icon type={showIcon} />
          </a>
        </div>

        {modificationsByType && Object.values(types).map((type) => {
          if (typeof type !== 'string') return
          return <ModificationGroup
            activeModification={activeModification}
            create={this._createModificationBy(type)}
            editModification={this._editModification}
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
