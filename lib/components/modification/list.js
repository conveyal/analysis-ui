import React, {PropTypes} from 'react'

import {MODIFICATION_TYPES} from '../../constants'
import DeepEqualComponent from '../deep-equal'
import Icon from '../icon'
import ModificationGroup from './group'
import VariantEditor from '../../containers/variant-editor'
import {Input} from '../input'
import messages from '../../utils/messages'

export default class ModificationsList extends DeepEqualComponent {
  static propTypes = {
    activeModification: PropTypes.object,
    bundleId: PropTypes.string.isRequired,
    defaultFeedId: PropTypes.string.isRequired,
    modifications: PropTypes.array.isRequired,
    modificationsByType: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    scenarioId: PropTypes.string.isRequired,
    variants: PropTypes.array.isRequired,

    createModification: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    updateModification: PropTypes.func.isRequired
  }

  state = {
    filteredModificationsByType: this._filterModifications({modifications: this.props.modifications}),
    filter: '',
    showAllOnMap: true
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      filteredModificationsByType: this._filterModifications({
        filter: this.state.filter,
        modifications: nextProps.modifications
      })
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

  _updateModification = (modification) => {
    const {bundleId, updateModification} = this.props
    updateModification({
      bundleId,
      modification
    })
  }

  _toggleShowAllOnMap = () => {
    const {modifications} = this.props
    const showAllOnMap = !this.state.showAllOnMap
    this.setState({showAllOnMap})
    modifications.forEach((m) =>
      this._updateModification({
        ...m,
        showOnMap: showAllOnMap
      }))
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
            tabIndex={0}
            title='Toggle all modifications map display'
            ><Icon type={showIcon} />
          </a>
        </div>

        <div className='block'>
          <Input
            aria-label={messages.modification.filter}
            name={messages.modification.filter}
            onChange={this._setFilter}
            type='text'
            value={filter || ''}
            />
        </div>

        {modificationsByType && MODIFICATION_TYPES.map((type) =>
          <ModificationGroup
            activeModification={activeModification}
            create={this._createModificationBy(type)}
            editModification={this._editModification}
            key={`modification-group-${type}`}
            modifications={filteredModificationsByType[type] || []}
            projectId={projectId}
            scenarioId={scenarioId}
            type={type}
            updateModification={this._updateModification}
            />
        )}
      </div>
    )
  }
}
