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
    filteredModificationsByType: this._filterModifications({modifications: this.props.modifications}),
    filter: '',
    showAllOnMap: true
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      ...this.state,
      filteredModificationsByType: this._filterModifications({filter: this.state.filter, modifications: nextProps.modifications})
    })
  }

  _filterModifications ({
    filter = '',
    modifications
  }) {
    const filterLcase = filter != null ? filter.toLowerCase() : null
    const filteredModificationsByType = {}

    modifications
      .filter((m) => filter === null || m.name.toLowerCase().indexOf(filterLcase) > -1)
      .forEach((m) => {
        filteredModificationsByType[m.type] = [...(filteredModificationsByType[m.type] || []), m]
      })

    return filteredModificationsByType
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
    const filter = e.target.value && e.target.value.length > 0 ? e.target.value : null

    this.setState({
      ...this.state,
      filter,
      filteredModificationsByType: this._filterModifications({filter, modifications: this.props.modifications})
    })
  }

  render () {
    const {activeModification, modificationsByType, projectId, scenarioId} = this.props
    const {showAllOnMap, filter, filteredModificationsByType} = this.state
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
          const modifications = filteredModificationsByType[type] || []
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
