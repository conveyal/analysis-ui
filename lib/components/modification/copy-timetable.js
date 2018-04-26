// @flow

import Icon from '@conveyal/woonerf/components/icon'
import fetch from 'isomorphic-fetch'
import React, {Component} from 'react'
import uuid from 'uuid'

import {ADD_TRIP_PATTERN} from '../../constants'
import {DEFAULT_SEGMENT_SPEED} from '../../constants/timetables'
import {Button} from '../buttons'
import {Select} from '../input'
import {ModalBody} from '../modal'

type ModelWithName = {
  _id: string,
  name: string
}

type Region = ModelWithName & {
  projects: Array<ModelWithName>
}

type Timetable = ModelWithName & {
  dwellTimes: Array<any>,
  segmentSpeeds: Array<number>
}

type Modification = ModelWithName & {
  segments: Array<any>,
  timetables: Array<Timetable>,
  type: string
}

type Props = {
  create: () => void,
  currentModification: Modification,
  currentRegionId: string,
  currentProject: ModelWithName,
  loadAllRegions: () => void,
  modifications: Array<Modification>
}

type State = {
  loadingModifications: boolean,
  loadingProjects: boolean,
  loadingRegions: boolean,
  modification: ?ModelWithName,
  modificationOptions: Array<Modification>,
  project: ?ModelWithName,
  projectOptions: Array<ModelWithName>,
  region: ?ModelWithName,
  regionOptions: Array<ModelWithName>,
  timetable: ?Timetable,
  timetableOptions: Array<Timetable>
}

export default class CopyTimetable extends Component {
  props: Props
  state: State

  constructor (props: Props) {
    super(props)
    this.state = {
      loadingModifications: true,
      loadingProjects: true,
      loadingRegions: true,
      modification: undefined,
      modificationOptions: [],
      project: undefined,
      projectOptions: [],
      region: undefined,
      regionOptions: [],
      timetable: undefined,
      timetableOptions: []
    }
  }

  componentWillMount () {
    fetch(`/api/region`)
      .then(response => response.json())
      .then(regions => {
        const {currentModification, currentProject, currentRegionId, modifications} = this.props
        const currentRegion = regions.find(region => region._id === currentRegionId)

        this.setState({
          loadingModifications: false,
          loadingProjects: false,
          loadingRegions: false,
          modification: currentModification,
          modificationOptions: filterModifications(modifications),
          project: currentProject,
          projectOptions: currentRegion ? currentRegion.projects : [],
          region: currentRegion,
          regionOptions: regions,
          timetable: currentModification ? currentModification.timetables[0] : undefined,
          timetableOptions: currentModification ? currentModification.timetables : []
        })
      })
  }

  async _loadModificationsFromProject (projectId: string) {
    const response = await fetch(`/api/project/${projectId}/modifications`)
    const modifications = await response.json()

    const filteredModifications = filterModifications(modifications)
    const firstModification = filteredModifications[0]

    if (!firstModification) {
      this.setState({
        loadingModifications: false,
        modification: undefined,
        modificationOptions: [],
        timetableOptions: []
      })
      return
    }

    this.setState({
      loadingModifications: false,
      modification: firstModification,
      modificationOptions: filteredModifications,
      timetable: firstModification.timetables[0],
      timetableOptions: firstModification.timetables
    })
  }

  _onConfirmTimetable = () => {
    const {currentModification} = this.props
    const {timetable} = this.state
    if (!timetable) {
      return
    }
    const numSegments = currentModification.segments ? currentModification.segments.length : 0
    this.props.create({
      ...timetable,
      _id: uuid.v4(),
      dwellTimes: makeCopiedArray(
        timetable.dwellTimes,
        numSegments,
        null
      ),
      phaseFromStop: null,
      phaseAtStop: null,
      segmentSpeeds: makeCopiedArray(
        timetable.segmentSpeeds,
        numSegments,
        DEFAULT_SEGMENT_SPEED
      )
    })
  }

  _onModificationChange = (e: Event & {target: HTMLInputElement}) => {
    const modification = this.state.modificationOptions.find(
      modification => modification._id === e.target.value
    )
    this.setState({
      modification,
      timetable: modification ? modification.timetables[0] : undefined,
      timetableOptions: modification ? modification.timetables : []
    })
  }

  _onProjectChange = async (e: Event & {target: HTMLInputElement}) => {
    const projectId = e.target.value
    this.setState({
      loadingModifications: true,
      modification: undefined,
      modificationOptions: [],
      project: this.state.projectOptions.find(project => project._id === projectId),
      timetableOptions: [],
      timetable: undefined
    })

    await this._loadModificationsFromProject(projectId)
  }

  _onRegionChange = async (e: Event & {target: HTMLInputElement}) => {
    const {regions} = this.props
    const regionId = e.target.value
    this.setState({
      loadingModifications: true,
      loadingProjects: true,
      modification: undefined,
      modificationOptions: [],
      project: undefined,
      region: regions.find(region => region._id === regionId),
      timetable: undefined,
      timetableOptions: []
    })

    // fetch projects in this region
    const response = await fetch(`/api/region/${regionId}`)
    const region: Region = await response.json()

    const firstProject = region.projects[0]
    if (!firstProject) {
      this.setState({
        loadingModifications: false,
        loadingProjects: false,
        modificationOptions: [],
        project: firstProject,
        projectOptions: region.projects,
        timetableOptions: []
      })
      return
    }
    this.setState({
      loadingProjects: false,
      project: firstProject,
      projectOptions: region.projects
    })

    this._loadModificationsFromProject(firstProject._id)
  }

  _onTimetableChange = (e: Event & {target: HTMLInputElement}) => {
    this.setState({
      timetable: this.state.timetableOptions.find(
        timetable => timetable._id === e.target.value
      )
    })
  }

  render () {
    const {
      loadingModifications,
      loadingProjects,
      loadingRegions,
      modification,
      modificationOptions,
      project,
      projectOptions,
      region,
      regionOptions,
      timetable,
      timetableOptions
    } = this.state
    if (loadingRegions || !region) {
      return (
        <ModalBody>
          <p>Loading...</p>
        </ModalBody>
      )
    }
    return (
      <ModalBody>
        <Select
          label='Region'
          onBlur={noop}
          onChange={this._onRegionChange}
          value={region._id}
        >
          {regionOptions.map(regionOption => (
            <option key={`regionOption-${regionOption._id}`} value={regionOption._id}>
              {getName(regionOption)}
            </option>
          ))}
        </Select>
        {loadingProjects && <p>Loading projects...</p>}
        {!loadingProjects && projectOptions.length === 0 &&
          <p>No projects created in this region</p>
        }
        {!loadingProjects && projectOptions.length > 0 &&
          <Select
            label='Project'
            onBlur={noop}
            onChange={this._onProjectChange}
            value={project && project._id}
          >
            {projectOptions.map(projectOption => (
              <option key={`projectOption-${projectOption._id}`} value={projectOption._id}>
                {getName(projectOption)}
              </option>
            ))}
          </Select>
        }
        {project && loadingModifications && <p>Loading modifications...</p>}
        {project && !loadingModifications && modificationOptions.length === 0 &&
          <p>No add trip pattern modifications created in this project</p>
        }
        {project && !loadingModifications && modificationOptions.length > 0 &&
          <Select
            label='Modification'
            onBlur={noop}
            onChange={this._onModificationChange}
            value={modification && modification._id}
          >
            {modificationOptions.map(modificationOption => (
              <option key={`modificationOption-${modificationOption._id}`} value={modificationOption._id}>
                {getName(modificationOption)}
              </option>
            ))}
          </Select>
        }
        {modification && timetableOptions.length === 0 &&
          <p>No timetables created in this modification</p>
        }
        {modification && timetableOptions.length > 0 &&
          <Select
            label='Timetable'
            onBlur={noop}
            onChange={this._onTimetableChange}
            value={timetable && timetable._id}
          >
            {timetableOptions.map(timetableOption => (
              <option key={`timetableOption-${timetableOption._id}`} value={timetableOption._id}>
                {getName(timetableOption)}
              </option>
            ))}
          </Select>
        }
        {timetable &&
          <p>
            <Button block onClick={this._onConfirmTimetable} style='success'>
              <Icon type='plus' /> Copy into new timetable
            </Button>
          </p>
        }
      </ModalBody>
    )
  }
}

function filterModifications (modifications) {
  return modifications.filter(modification => modification.type === ADD_TRIP_PATTERN)
}

function getName (entity) {
  return entity.name || 'unnamed'
}

function makeCopiedArray (
  arrayToCopy: Array<number>,
  numSegments: number,
  defaultValue: any
): Array<number> {
  const arr = arrayToCopy.slice(0, numSegments)
  if (defaultValue > 0 && arr.length < numSegments) {
    for (let i = 0; i < numSegments - arr.length; i++) {
      arr.push(defaultValue)
    }
  }
  return arr
}

function noop () {}
