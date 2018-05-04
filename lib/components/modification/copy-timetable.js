// @flow

import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import fetch from 'isomorphic-fetch'
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
  loadAllRegions: () => void
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

  constructor (props: Props) {
    super(props)
    // Use fetch here because the resulting data is
    // only specific to this particular component
    fetch('/api/timetables')
      .then(response => response.json())
      // the response will return only ADD_TRIP_PATTERN modifications
      .then((regions: Array<Region>) => {
        // have to reassign to avoid a flow error
        let {
          currentModification: curModification,
          currentProject: curProject,
          currentRegionId
        } = this.props

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

        this._calculateNewState({
          currentModification,
          currentProject,
          currentRegion,
          currentTimetable: currentModification
            ? currentModification.timetables[0]
            : undefined,
          regions
        })
      })
  }

  _calculateNewState ({
    currentModification,
    currentProject,
    currentRegion,
    currentTimetable,
    regions
  }: {
    currentModification?: ?Modification,
    currentProject?: ?Project,
    currentRegion?: ?Region,
    currentTimetable?: ?Timetable,
    regions?: Array<Region>
  }) {
    regions = regions || this.state.data

    // if the region changes, take note so we can select first available project
    let regionChanged = false
    if (currentRegion) {
      regionChanged = true
    } else {
      currentRegion = this.state.region
    }

    // if the project changes, take note so we can select first available modification
    let projectChanged = false
    if (currentProject) {
      projectChanged = true
    } else if (regionChanged) {
      // region has changed, so select first available project if possible
      projectChanged = true
      currentProject = currentRegion && currentRegion.projects && currentRegion.projects.length > 0
        ? currentRegion.projects[0]
        : undefined
    } else {
      currentProject = this.state.project
    }

    currentModification = currentModification || (
      projectChanged
        // project has changed, so select first available modification if possible
        ? currentProject &&
            currentProject.modifications &&
            currentProject.modifications.length > 0
              ? currentProject.modifications[0]
              : undefined
        : this.state.modification
    )

    // at this point, either a timetable will be set directly
    // or the timetable will be derived from the selected modification
    currentTimetable = currentTimetable || (
      currentModification &&
        currentModification.timetables &&
        currentModification.timetables.length > 0
          ? currentModification.timetables[0]
          : undefined
    )

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

  _onSelectChange = memoize(
    (entityType: 'Modification' | 'Project' | 'Region' | 'Timetable') =>
      (e: Event & {target: HTMLInputElement}) => {
        this._calculateNewState({
          [`current${entityType}`]: this.state[`${entityType.toLowerCase()}Options`].find(
            entity => entity._id === e.target.value
          )
        })
      }
  )

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
          onChange={this._onSelectChange('Region')}
          value={region._id}
        >
          {regionOptions.map(regionOption => (
            <option key={`regionOption-${regionOption._id}`} value={regionOption._id}>
              {getName(regionOption)}
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
            onChange={this._onSelectChange('Project')}
            value={project && project._id}
          >
            {projectOptions.map(projectOption => (
              <option key={`projectOption-${projectOption._id}`} value={projectOption._id}>
                {getName(projectOption)}
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
            onChange={this._onSelectChange('Modification')}
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
            onChange={this._onSelectChange('Timetable')}
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
