import {
  faEye,
  faEyeSlash,
  faPencilAlt,
  faPlus,
  faUpload
} from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {withRouter} from 'next/router'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {createModification, updateModification} from 'lib/actions/modifications'
import {RouteTo} from 'lib/constants'
import message from 'lib/message'

import {Application, Dock, Title} from '../base'
import {Button} from '../buttons'
import Icon from '../icon'
import {Group, Input} from '../input'
import ProjectTitle from '../project-title'
import Tip from '../tip'
import VariantEditor from '../variant-editor'

import CreateModification from './create'
import ModificationGroup from './group'

const ModificationsMap = dynamic(
  () => import('lib/containers/modifications-map'),
  {ssr: false}
)

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

function useProject(pid) {
  return useSelector(s => s.project.projects.find(p => p._id === pid))
}

function ModificationsList(p) {
  const dispatch = useDispatch()

  // Get the query data
  const {projectId} = p.router.query

  // Retrieve the data from the store
  const modifications = useSelector(state => state.project.modifications)
  const project = useProject(projectId)

  const [filter, setFilter] = React.useState('')
  const [showAll, setShowAll] = React.useState(true)
  const [showCreate, setShowCreate] = React.useState(false)
  const [filteredModificationsByType, setFiltered] = React.useState({})

  const regionId = project.regionId
  const showIcon = showAll ? faEye : faEyeSlash

  // Update filtered modifications when the filter changes
  React.useEffect(() => {
    setFiltered(filterModifications(filter, modifications))
  }, [filter, modifications])

  // Show/hide all modifications on the map
  const toggleShowAll = React.useCallback(() => {
    const showOnMap = !showAll
    setShowAll(showOnMap)
    modifications.forEach(m => dispatch(updateModification({...m, showOnMap})))
  }, [dispatch, modifications, setShowAll, showAll])

  const create = React.useCallback(
    ({name, type}) => {
      return dispatch(
        createModification({
          feedId: p.feeds[0].id, // default to the first feed
          name,
          projectId,
          type,
          variants: project.variants.map(() => true)
        })
      ).then(m => {
        p.router.push({
          pathname: RouteTo.modificationEdit,
          query: {
            regionId,
            projectId,
            modificationId: m._id
          }
        })
      })
    },
    [dispatch, p.feeds, project, p.router, projectId, regionId]
  )

  const update = React.useCallback(
    m => {
      dispatch(updateModification(m))
    },
    [dispatch]
  )

  return (
    <Application map={() => <ModificationsMap />} {...p}>
      <ProjectTitle project={project} />
      <Title>
        <Icon icon={faPencilAlt} /> {message('modification.plural')}
        <Tip
          className={`ShowOnMap pull-right ${
            showAll ? 'active' : 'dim'
          } fa-btn`}
          tip='Toggle all modifications map display'
        >
          <a onClick={toggleShowAll}>
            <Icon icon={showIcon} />
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
              <Icon icon={faUpload} />
            </a>
          </Link>
        </Tip>
      </Title>
      <Dock>
        <VariantEditor variants={project.variants} />
        <Group>
          <Button block onClick={() => setShowCreate(true)} style='success'>
            <Icon icon={faPlus} />
            {message('modification.create')}
          </Button>
        </Group>

        <Group>
          <Input
            name={message('modification.filter')}
            onChange={e => setFilter(e.target.value)}
            type='text'
            value={filter}
          />
        </Group>

        {Object.keys(filteredModificationsByType).map(type => (
          <ModificationGroup
            key={`modification-group-${type}`}
            modifications={filteredModificationsByType[type]}
            projectId={projectId}
            regionId={regionId}
            type={type}
            updateModification={update}
          />
        ))}
      </Dock>

      {showCreate && (
        <CreateModification hide={() => setShowCreate(false)} create={create} />
      )}
    </Application>
  )
}

// Expose next/router to the List
export default withRouter(ModificationsList)
