// @flow
import Icon from '@conveyal/woonerf/components/icon'
import toStartCase from 'lodash/startCase'
import React, {Component} from 'react'

import {Button} from '../buttons'
import {MODIFICATION_TYPES} from '../../constants'
import InnerDock from '../inner-dock'
import {IconLink} from '../link'
import Modal, {ModalBody, ModalTitle} from '../modal'
import ModificationGroup from './group'
import VariantEditor from '../../containers/variant-editor'
import {Group, Input, Text, Select} from '../input'
import messages from '../../utils/messages'

import type {Modification, Project} from '../../types'

type Props = {
  activeModification?: Modification,
  modifications: Modification[],
  project: Project,
  projectId: string,

  createModification: ({name: string, type: string}) => void,
  push: string => void,
  updateModification: (modification: Modification) => void
}

type State = {
  filter: string,
  filteredModificationsByType: {
    [type: string]: Modification[]
  },
  showAllOnMap: boolean,
  showCreateModification: boolean
}

export default class ModificationsList extends Component {
  props: Props
  state: State

  state = {
    filteredModificationsByType: this._filterModifications({
      modifications: this.props.modifications
    }),
    filter: '',
    newModificationName: '',
    newModificationType: MODIFICATION_TYPES[0],
    showAllOnMap: true,
    showCreateModification: false
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setState({
      filteredModificationsByType: this._filterModifications({
        filter: this.state.filter,
        modifications: nextProps.modifications
      })
    })
  }

  _filterModifications ({
    filter,
    modifications
  }: {
    filter?: string,
    modifications: Modification[]
  }) {
    const filterLcase = filter != null ? filter.toLowerCase() : ''
    const filteredModificationsByType = {}

    modifications
      .filter(
        m => filter === null || m.name.toLowerCase().indexOf(filterLcase) > -1
      )
      .forEach(m => {
        filteredModificationsByType[m.type] = [
          ...(filteredModificationsByType[m.type] || []),
          m
        ]
      })

    return filteredModificationsByType
  }

  _createModification = () => {
    const {newModificationName, newModificationType} = this.state
    this.props.createModification({
      name: newModificationName,
      type: newModificationType
    })
    this.setState({
      newModificationName: '',
      newModificationType: MODIFICATION_TYPES[0]
    })
    this._hideCreateModification()
  }

  _showCreateModification = () => {
    this.setState({showCreateModification: true})
  }

  _hideCreateModification = () => {
    this.setState({showCreateModification: false})
  }

  _updateModification = (modification: any) => {
    this.props.updateModification(modification)
  }

  _toggleShowAllOnMap = () => {
    const {modifications} = this.props
    const showAllOnMap = !this.state.showAllOnMap
    this.setState({showAllOnMap})
    modifications.forEach(m =>
      this._updateModification({
        ...m,
        showOnMap: showAllOnMap
      })
    )
  }

  _goToEditModification = (_id: string) => {
    const {push, projectId} = this.props
    push(`/projects/${projectId}/modifications/${_id}`)
  }

  _setFilter = (e: Event & {target: HTMLInputElement}) => {
    const filter = e.target.value && e.target.value.length > 0
      ? e.target.value
      : ''

    this.setState({
      filter,
      filteredModificationsByType: this._filterModifications({
        filter,
        modifications: this.props.modifications
      })
    })
  }

  render () {
    const {activeModification, projectId} = this.props
    const {
      filter,
      filteredModificationsByType,
      newModificationName,
      showAllOnMap,
      showCreateModification
    } = this.state
    const showIcon = showAllOnMap ? 'eye' : 'eye-slash'

    return (
      <div>
        <div className='ApplicationDockTitle'>
          <Icon type='pencil' /> Modifications

          <IconLink
            className={`ShowOnMap pull-right ${showAllOnMap ? 'active' : 'dim'} fa-btn`}
            onClick={this._toggleShowAllOnMap}
            title='Toggle all modifications map display'
            type={showIcon}
          />
          <IconLink
            className='pull-right'
            to={`/projects/${projectId}/import-modifications`}
            title={messages.project.importModifications}
            type='download'
          />
        </div>

        <InnerDock>
          <VariantEditor />

          <div className='block'>
            <Group>
              <Button
                block
                onClick={this._showCreateModification}
                style='success'
              >
                <Icon type='plus' /> Create a modification
              </Button>
            </Group>

            <Group>
              <Input
                name={messages.modification.filter}
                onChange={this._setFilter}
                type='text'
                value={filter || ''}
              />
            </Group>
          </div>

          {MODIFICATION_TYPES.filter(
              type => filteredModificationsByType[type]
            ).map(type => (
              <ModificationGroup
                activeModification={activeModification}
                goToEditModification={this._goToEditModification}
                key={`modification-group-${type}`}
                modifications={filteredModificationsByType[type]}
                projectId={projectId}
                type={type}
                updateModification={this._updateModification}
              />
            ))}
        </InnerDock>

        {showCreateModification &&
          <Modal onRequestClose={this._hideCreateModification}>
            <ModalTitle>Create new modification</ModalTitle>
            <ModalBody>
              <Select
                label='Modification Type'
                onChange={e =>
                  this.setState({newModificationType: e.target.value})}
              >
                {MODIFICATION_TYPES.map(type => (
                  <option key={`type-${type}`} value={type}>
                    {toStartCase(type)}
                  </option>
                ))}
              </Select>
              <Text
                label='Modification Name*'
                onChange={e =>
                  this.setState({newModificationName: e.target.value})}
              />
              <Button
                block
                disabled={
                  !newModificationName || newModificationName.length === 0
                }
                onClick={this._createModification}
                style='success'
              >
                <Icon type='plus' /> Create Modification
              </Button>
            </ModalBody>
          </Modal>}
      </div>
    )
  }
}
