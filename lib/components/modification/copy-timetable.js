// @flow

import Icon from '@conveyal/woonerf/components/icon'
import get from 'lodash/get'
import React, {Component} from 'react'
import uuid from 'uuid'

import {DEFAULT_SEGMENT_SPEED} from '../../constants/timetables'
import {Button} from '../buttons'
import {Select} from '../input'
import {ModalBody} from '../modal'

type ModelWithName = {
  _id: string,
  name: string
}

type Timetable = ModelWithName & {
  dwellTimes: Array<any>,
  segmentSpeeds: Array<number>
}

type Modification = ModelWithName & {
  segments: Array<any>,
  timetables: Array<Timetable>
}

type Project = ModelWithName & {
  modifications: Array<Modification>
}

type Region = ModelWithName & {
  projects: Array<Project>
}

type Props = {
  create: () => void,
  currentModification: Modification,
  currentRegionId: string,
  currentProject: Project,
  getTimetables: () => Promise<{
    status: number,
    value: ?Array<Region>
  }>
}

type State = {
  data: any,
  loadingData: boolean,
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

  state = {
    data: [],
    loadingData: true,
    modification: undefined,
    modificationOptions: [],
    project: undefined,
    projectOptions: [],
    region: undefined,
    regionOptions: [],
    timetable: undefined,
    timetableOptions: []
  }

  componentDidMount () {
    const {
      currentModification: curModification,
      currentProject: curProject,
      currentRegionId,
      getTimetables
    } = this.props

    getTimetables()
      .then(response => {
        if (!response.status === 200) return
        const regions: Array<Region> = (response.value: any)

        // recalculate currents to make sure we're using the data from the
        // api/timetable webservice
        // in the store, projects don't have lists of modifications
        const currentRegion: ?Region = regions.find(region => region._id === currentRegionId)
        let currentProject
        if (currentRegion) {
          currentProject = currentRegion.projects.find(
            project => project._id === curProject._id
          )
        }

        let currentModification
        if (currentProject) {
          currentModification = currentProject.modifications.find(
            modification => modification._id === curModification._id
          )
        }

        const currentTimetable = currentModification &&
            currentModification.timetables &&
            currentModification.timetables.length > 0
              ? currentModification.timetables[0]
              : undefined

        this.setState({
          data: regions,
          loadingData: false,
          modification: currentModification,
          modificationOptions: currentProject ? currentProject.modifications : [],
          project: currentProject,
          projectOptions: currentRegion ? currentRegion.projects : [],
          region: currentRegion,
          regionOptions: regions,
          timetable: currentTimetable,
          timetableOptions: currentModification ? currentModification.timetables : []
        })
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
      dwellTimes: timetable.dwellTimes.slice(0, numSegments),
      phaseAtStop: null,
      phaseFromStop: null,
      segmentSpeeds: numSegments > timetable.segmentSpeeds.length
        ? Array(numSegments)
          .fill(DEFAULT_SEGMENT_SPEED)
          .map((v, i) => timetable.segmentSpeeds[i] || v)
        : timetable.segmentSpeeds.slice(0, numSegments)
    })
  }

  _getStateForNewProject (project: ?Project): {
    project: ?Project,
    modification: ?Modification,
    modificationOptions: Array<Modification>,
    timetable: ?Timetable,
    timetableOptions: Array<Timetable>
  } {
    const modificationOptions = (project || {}).modifications || []
    const modification = modificationOptions[0]
    const timetableOptions = (modification || {}).timetables || []
    const timetable = timetableOptions[0]
    return {
      modification,
      modificationOptions,
      project,
      timetable,
      timetableOptions
    }
  }

  _onSelectModification = (e: Event & {target: HTMLInputElement}) => {
    const modification: Modification = (
      // cast to make flow happy
      this.state.modificationOptions.find(m => m._id === e.target.value): any
    )
    this.setState({
      modification,
      timetable: (modification.timetables || [])[0],
      timetableOptions: modification.timetables
    })
  }

  _onSelectProject = (e: Event & {target: HTMLInputElement}) => {
    const project = this.state.projectOptions.find(p => p._id === e.target.value)
    this.setState(this._getStateForNewProject(project))
  }

  _onSelectRegion = (e: Event & {target: HTMLInputElement}) => {
    const region: Region = (
      // cast to make flow happy
      this.state.regionOptions.find(r => r._id === e.target.value): any
    )
    const projectOptions = region.projects || []
    this.setState({
      ...this._getStateForNewProject(projectOptions[0]),
      projectOptions,
      region
    })
  }

  _onSelectTimetable = (e: Event & {target: HTMLInputElement}) => {
    this.setState({
      timetable: this.state.timetableOptions.find(tt => tt._id === e.target.value)
    })
  }

  render () {
    const {
      loadingData,
      modification,
      modificationOptions,
      project,
      projectOptions,
      region,
      regionOptions,
      timetable,
      timetableOptions
    } = this.state
    if (loadingData || !region) {
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
          onChange={this._onSelectRegion}
          value={region._id}
        >
          {regionOptions.map(regionOption => (
            <option key={`regionOption-${regionOption._id}`} value={regionOption._id}>
              {get(regionOption, 'name', 'unnamed')}
            </option>
          ))}
        </Select>
        {projectOptions.length === 0 &&
          <p>No projects created in this region</p>
        }
        {projectOptions.length > 0 &&
          <Select
            label='Project'
            onBlur={noop}
            onChange={this._onSelectProject}
            value={project && project._id}
          >
            {projectOptions.map(projectOption => (
              <option key={`projectOption-${projectOption._id}`} value={projectOption._id}>
                {get(projectOption, 'name', 'unnamed')}
              </option>
            ))}
          </Select>
        }
        {project && modificationOptions.length === 0 &&
          <p>No add trip pattern modifications created in this project</p>
        }
        {project && modificationOptions.length > 0 &&
          <Select
            label='Modification'
            onBlur={noop}
            onChange={this._onSelectModification}
            value={modification && modification._id}
          >
            {modificationOptions.map(modificationOption => (
              <option key={`modificationOption-${modificationOption._id}`} value={modificationOption._id}>
                {get(modificationOption, 'name', 'unnamed')}
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
            onChange={this._onSelectTimetable}
            value={timetable && timetable._id}
          >
            {timetableOptions.map(timetableOption => (
              <option key={`timetableOption-${timetableOption._id}`} value={timetableOption._id}>
                {get(timetableOption, 'name', 'unnamed')}
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

function noop () {}
