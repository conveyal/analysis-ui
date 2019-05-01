import {
  faCheck,
  faEye,
  faEyeSlash,
  faPencilAlt,
  faPlus,
  faUpload
} from '@fortawesome/free-solid-svg-icons'
import toStartCase from 'lodash/startCase'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'

import message from '../../message'

import {Application, Dock, Title} from '../base'
import {Button} from '../buttons'
import {MODIFICATION_TYPES, RouteTo} from '../../constants'
import Icon from '../icon'
import Modal, {ModalBody, ModalTitle} from '../modal'
import ProjectTitle from '../../containers/project-title'
import VariantEditor from '../../containers/variant-editor'
import {Group, Input, Text, Select} from '../input'
import Tip from '../tip'

const LabelLayer = dynamic(() => import('../map/label-layer'), {ssr: false})
const ModificationsMap = dynamic(
  () => import('../../containers/modifications-map'),
  {ssr: false}
)

import ModificationGroup from './group'

function filterModifications(filter, modifications) {
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

export default function ModificationsList(p) {
  const [filter, setFilter] = React.useState('')
  const [showAll, setShowAll] = React.useState(true)
  const [showCreate, setShowCreate] = React.useState(false)
  const [filteredModificationsByType, setFiltered] = React.useState({})

  React.useEffect(() => {
    setFiltered(filterModifications(filter, p.modifications))
  }, [filter, p.modifications])

  function toggleShowAll() {
    const showOnMap = !showAll
    setShowAll(showOnMap)
    p.modifications.forEach(m => p.updateModification({...m, showOnMap}))
  }

  const {projectId, regionId} = p
  const showIcon = showAll ? faEye : faEyeSlash

  return (
    <Application
      map={() => (
        <>
          <LabelLayer />
          <ModificationsMap />
        </>
      )}
      {...p}
    >
      <ProjectTitle />
      <Title>
        <Icon icon={faPencilAlt} fixedWidth /> {message('modification.plural')}
        <Tip
          className={`ShowOnMap pull-right ${
            showAll ? 'active' : 'dim'
          } fa-btn`}
          tip='Toggle all modifications map display'
        >
          <a onClick={toggleShowAll}>
            <Icon icon={showIcon} fixedWidth />
          </a>
        </Tip>
        <Tip
          className='pull-right'
          tip={message('project.importModifications')}
        >
          <Link
            href={{
              pathname: RouteTo.modificationImport,
              query: {projectId, regionId}
            }}
          >
            <a>
              <Icon icon={faUpload} fixedWidth />
            </a>
          </Link>
        </Tip>
      </Title>
      <Dock>
        <VariantEditor />
        <Group>
          <Button block onClick={() => setShowCreate(true)} style='success'>
            <Icon icon={faPlus} fixedWidth />
            {message('modification.create')}
          </Button>
        </Group>

        <Group>
          <Input
            name={message('modification.filter')}
            onChange={e => setFilter(e.target.value)}
            type='text'
            value={filter || ''}
          />
        </Group>

        {Object.keys(filteredModificationsByType).map(type => (
          <ModificationGroup
            goToEditModification={p.goToEditModification}
            key={`modification-group-${type}`}
            modifications={filteredModificationsByType[type]}
            projectId={p.projectId}
            type={type}
            updateModification={p.updateModification}
          />
        ))}
      </Dock>

      {showCreate && (
        <CreateModification
          hide={() => setShowCreate(false)}
          create={p.createModification}
        />
      )}
    </Application>
  )
}

function CreateModification(p) {
  const [type, setType] = React.useState(MODIFICATION_TYPES[0])
  const [name, setName] = React.useState('')

  return (
    <Modal onRequestClose={p.hide}>
      <ModalTitle>Create new modification</ModalTitle>
      <ModalBody>
        <Select
          label={message('modification.type')}
          onChange={e => setType(e.target.value)}
        >
          {MODIFICATION_TYPES.map(type => (
            <option key={`type-${type}`} value={type}>
              {toStartCase(type)}
            </option>
          ))}
        </Select>
        <Text
          label={message('modification.name')}
          onChange={e => setName(e.target.value)}
        />
        <Button
          block
          disabled={!name || name.length === 0}
          onClick={() => {
            p.create({name, type})
            p.hide()
          }}
          style='success'
        >
          <Icon icon={faCheck} fixedWidth /> {message('common.create')}
        </Button>
      </ModalBody>
    </Modal>
  )
}
