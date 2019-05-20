import {faExclamationCircle, faPlus} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import React, {Component} from 'react'
import uuid from 'uuid'

import {DEFAULT_SEGMENT_SPEED} from 'lib/constants/timetables'
import message from 'lib/message'

import {Button} from '../buttons'
import Icon from '../icon'
import {Select} from '../input'
import {ModalBody} from '../modal'

export default class CopyTimetable extends Component {
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

  componentDidMount() {
    const {
      currentModification: curModification,
      currentProject: curProject,
      currentRegionId,
      getTimetables
    } = this.props

    getTimetables(response => {
      if (!response.status === 200) return
      const regions = response.value

      // Recalculate currents to make sure we're using the data from the
      // api/timetable webservice. In the store, projects don't have lists of
      // modifications.
      let currentRegion = regions.find(region => region._id === currentRegionId)

      // The webservice only returns a hierarchical list of regions, projects,
      // modifications objects that have a timetable at the bottom of the
      // hierarchy. Therefore, we'll select the first region that is available
      // if the current region wasn't found in the webservice
      if (!currentRegion) currentRegion = regions[0]

      // Find the project
      let currentProject
      if (currentRegion) {
        currentProject = currentRegion.projects.find(
          project => project._id === curProject._id
        )

        // If the current project we're on doesn't have a timetable, select
        // the first project returned by the webservice
        if (!currentProject) {
          currentProject = currentRegion.projects[0]
        }
      }

      let currentModification
      if (currentProject) {
        currentModification = currentProject.modifications.find(
          modification => modification._id === curModification._id
        )

        // If the current modification we're on doesn't have a timetable,
        // select the first modification returned by the webservice
        if (!currentModification) {
          currentModification = currentProject.modifications[0]
        }
      }

      const currentTimetable =
        currentModification &&
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
        timetableOptions: currentModification
          ? currentModification.timetables
          : []
      })
    })
  }

  _onConfirmTimetable = () => {
    const {currentModification} = this.props
    const {timetable} = this.state
    if (!timetable) {
      return
    }
    const numSegments = currentModification.segments
      ? currentModification.segments.length
      : 0

    this.props.create({
      ...timetable,
      _id: uuid.v4(),
      dwellTimes: timetable.dwellTimes.slice(0, numSegments),
      name: `Copy of ${timetable.name}`,
      phaseAtStop: null,
      phaseFromStop: null,
      segmentSpeeds:
        numSegments > timetable.segmentSpeeds.length
          ? Array(numSegments)
              .fill(DEFAULT_SEGMENT_SPEED)
              .map((v, i) => timetable.segmentSpeeds[i] || v)
          : timetable.segmentSpeeds.slice(0, numSegments)
    })
  }

  _getStateForNewProject(project) {
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

  _onSelectModification = e => {
    const modification =
      // cast to make flow happy
      this.state.modificationOptions.find(m => m._id === e.target.value)
    this.setState({
      modification,
      timetable: (modification.timetables || [])[0],
      timetableOptions: modification.timetables
    })
  }

  _onSelectProject = e => {
    const project = this.state.projectOptions.find(
      p => p._id === e.target.value
    )
    this.setState(this._getStateForNewProject(project))
  }

  _onSelectRegion = e => {
    const region =
      // cast to make flow happy
      this.state.regionOptions.find(r => r._id === e.target.value)
    const projectOptions = region.projects || []
    this.setState({
      ...this._getStateForNewProject(projectOptions[0]),
      projectOptions,
      region
    })
  }

  _onSelectTimetable = e => {
    this.setState({
      timetable: this.state.timetableOptions.find(
        tt => tt._id === e.target.value
      )
    })
  }

  render() {
    const {currentModification} = this.props
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

    // render loading dialog if loading
    if (loadingData) {
      return (
        <ModalBody>
          <p>Loading...</p>
        </ModalBody>
      )
    }

    // if not loading and the region does not exist that means there are no
    // timetables to select from. Show advisory message.
    if (!region) {
      return (
        <ModalBody>
          <div className='alert alert-danger' role='alert'>
            <Icon icon={faExclamationCircle} />
            No timetables available to copy from! Please create a timetable
            manually.
          </div>
        </ModalBody>
      )
    }

    // we have timetables to select, show selectors
    return (
      <ModalBody>
        <Select
          label='Region'
          onBlur={noop}
          onChange={this._onSelectRegion}
          value={region._id}
        >
          {regionOptions.map(regionOption => (
            <option
              key={`regionOption-${regionOption._id}`}
              value={regionOption._id}
            >
              {get(regionOption, 'name', 'unnamed')}
            </option>
          ))}
        </Select>
        <Select
          label='Project'
          onBlur={noop}
          onChange={this._onSelectProject}
          value={project && project._id}
        >
          {projectOptions.map(projectOption => (
            <option
              key={`projectOption-${projectOption._id}`}
              value={projectOption._id}
            >
              {get(projectOption, 'name', 'unnamed')}
            </option>
          ))}
        </Select>
        <Select
          label='Modification'
          onBlur={noop}
          onChange={this._onSelectModification}
          value={modification && modification._id}
        >
          {modificationOptions.map(modificationOption => (
            <option
              key={`modificationOption-${modificationOption._id}`}
              value={modificationOption._id}
            >
              {get(modificationOption, 'name', 'unnamed')}
            </option>
          ))}
        </Select>
        <Select
          label='Timetable'
          onBlur={noop}
          onChange={this._onSelectTimetable}
          value={timetable && timetable._id}
        >
          {timetableOptions.map(timetableOption => (
            <option
              key={`timetableOption-${timetableOption._id}`}
              value={timetableOption._id}
            >
              {get(timetableOption, 'name', 'unnamed')}
            </option>
          ))}
        </Select>
        {modification &&
          currentModification.segments.length !==
            modification.segments.length && (
            <div className='alert alert-info' role='alert'>
              <Icon icon={faExclamationCircle} />
              {(currentModification.segments.length === 0 ||
                modification.segments.length === 0) &&
                message('modification.copyTimetable.noSegments', {
                  segmentSpeed: DEFAULT_SEGMENT_SPEED
                })}
              {currentModification.segments.length >
                modification.segments.length &&
                modification.segments.length > 0 &&
                message('modification.copyTimetable.curHasMoreSegments', {
                  numSegments: modification.segments.length,
                  segmentSpeed: DEFAULT_SEGMENT_SPEED
                })}
              {currentModification.segments.length <
                modification.segments.length &&
                currentModification.segments.length > 0 &&
                message('modification.copyTimetable.curHasLessSegments', {
                  numSegments: currentModification.segments.length
                })}
            </div>
          )}
        <p>
          <Button block onClick={this._onConfirmTimetable} style='success'>
            <Icon icon={faPlus} /> Copy into new timetable
          </Button>
        </p>
      </ModalBody>
    )
  }
}

function noop() {}
