import React, {PropTypes} from 'react'

import DeepEqualComponent from '../deep-equal'
import Icon from '../icon'
import * as types from '../../utils/modification-types'
import ModificationGroup from './group'
import VariantEditor from '../../containers/variant-editor'
import {Input} from '../input'
import messages from '../../utils/messages'

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
    showAllOnMap: true,
    filter: ''
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

  _setFilter = (e) => {
    this.setState({
      ...this.state,
      filter: e.target.value && e.target.value.length > 0 ? e.target.value : null
    })
  }

  render () {
    const {activeModification, modificationsByType, projectId, scenarioId} = this.props
    const {showAllOnMap, filter} = this.state
    const showIcon = showAllOnMap ? 'eye' : 'eye-slash'
    const filterLcase = filter != null ? filter.toLowerCase() : null

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

        <div className='block'>
          <Input
            aria-label={messages.modification.filter}
            placeholder={messages.modification.filter}
            onChange={this._setFilter}
            type='text'
            value={filter || ''}
            />
        </div>

        {modificationsByType && Object.values(types).map((type) => {
          if (typeof type !== 'string') return
          const modifications = modificationsByType[type]
            ? modificationsByType[type]
                .filter(m => filter == null || m.name.toLowerCase().indexOf(filterLcase) > -1)
            : []
          return <ModificationGroup
            activeModification={activeModification}
            create={this._createModificationBy(type)}
            editModification={this._editModification}
            key={`modification-group-${type}`}
            modifications={modifications}
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
