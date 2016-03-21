/**
 * The main component that controls the scenario editor, and handles the map.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SET_PROJECT, SET_GRAPH, REPLACE_MODIFICATION, UPDATE_DATA, DELETE_MODIFICATION, ADD_LAYER, REMOVE_LAYER, ADD_CONTROL, REMOVE_CONTROL } from './action-types'
import Modal from 'react-modal'
import uuid from 'uuid'
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import Scenario from './scenario'
import store from './store'
import ImportShapefile from './import-shapefile'
import UploadBundle from './upload-bundle'
import getDataForModifications from './get-data-for-modifications'
import { createAction } from 'redux-actions'
import PatternLayer from './map/pattern-layer'
import './map.css'
import colors from './colors'

function mapStateToProps (state) {
  return state
}

/** update data from the graphql API */
const updateData = createAction(UPDATE_DATA)

/** Create functions that are passed to the component in props, which update the state */
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setProject: function (project) {
      // fetch new data from graphql api
      getDataForModifications({ modifications: [...project.modifications.values()], bundleId: project.bundleId })
        .then((data) => dispatch(updateData(data)))

      return {
        type: SET_PROJECT,
        project
      }
    },

    setGraphId: function (bundleId) {
      // fetch new data from graphql api
      getDataForModifications({ modifications: store.getState().modifications.values(), bundleId })
        .then((data) => dispatch(updateData(data)))
      return {
        type: SET_GRAPH,
        bundleId
      }
    },

    /** replace a modification */
    replaceModification: function (modification) {
      // fetch new data from graphql api
      let state = store.getState()
      getDataForModifications({ modifications: [...state.modifications.values(), modification], bundleId: state.bundleId })
        .then((data) => dispatch(updateData(data)))

      return {
        type: REPLACE_MODIFICATION,
        modification
      }
    },

    /** delete a modification */
    deleteModification: function (modificationId) {
      return {
        type: DELETE_MODIFICATION,
        id: modificationId
      }
    },

    /** add a map layer */
    addLayer: function (layerId, layer) {
      return {
        type: ADD_LAYER,
        layer,
        layerId
      }
    },

    /** remove a map layer */
    removeLayer: function (layerId) {
      return {
        type: REMOVE_LAYER,
        layerId
      }
    },

    /** add a map control */
    addControl: function (controlId, control) {
      return {
        type: ADD_CONTROL,
        controlId,
        control
      }
    },

    /** remove a map control */
    removeControl: function (controlId) {
      return {
        type: REMOVE_CONTROL,
        controlId
      }
    }

  }, dispatch)
}

class ScenarioEditor extends Component {
  constructor (props) {
    super(props)
    this.state = { projectSelectOpen: false, importShapefileOpen: false }
    this.openProjectSelectDialog = this.openProjectSelectDialog.bind(this)
    this.closeProjectSelectDialog = this.closeProjectSelectDialog.bind(this)
    this.openImportShapefile = this.openImportShapefile.bind(this)
    this.closeImportShapefile = this.closeImportShapefile.bind(this)
    this.openBundleUpload = this.openBundleUpload.bind(this)
    this.closeBundleUpload = this.closeBundleUpload.bind(this)
    this.updateNewProjectName = this.updateNewProjectName.bind(this)
    this.createNewProject = this.createNewProject.bind(this)
    this.selectProject = this.selectProject.bind(this)
    this.selectGraph = this.selectGraph.bind(this)
    this.exportScenario = this.exportScenario.bind(this)
  }

  openProjectSelectDialog () {
    this.setState(Object.assign({}, this.state, { projectSelectOpen: true }))
  }

  closeProjectSelectDialog () {
    this.setState(Object.assign({}, this.state, { projectSelectOpen: false }))
  }

  openImportShapefile () {
    this.setState(Object.assign({}, this.state, { importShapefileOpen: true }))
  }

  closeImportShapefile () {
    this.setState(Object.assign({}, this.state, { importShapefileOpen: false }))
  }

  updateNewProjectName (e) {
    this.setState(Object.assign({}, this.state, { newProjectName: e.target.value }))
  }

  openBundleUpload (e) {
    this.setState(Object.assign({}, this.state, { bundleUploadOpen: true }))
  }

  closeBundleUpload (e) {
    this.setState(Object.assign({}, this.state, { bundleUploadOpen: false }))
  }

  createNewProject () {
    this.props.setProject({
      id: uuid.v4(),
      name: this.state.newProjectName,
      modifications: new Map()
    })
    this.closeProjectSelectDialog()
  }

  selectProject (e) {
    store.projectStore.getProject(e.target.getAttribute('data-project'))
      .then(p => this.props.setProject(p))
    this.closeProjectSelectDialog()
  }

  selectGraph () {
    // TODO don't ever use window.prompt. ever.
    let bundleId = window.prompt('Enter graph ID')
    if (bundleId) this.props.setGraphId(bundleId)
  }

  /** export the scenario */
  exportScenario () {
    // convert the scenario to json
    let scenario = {
      bundleId: this.props.bundleId,
      modifications: []
    }

    for (let m of this.props.modifications.values()) {
      m = Object.assign({}, m)
      m.id = undefined // remove ID
      scenario.modifications.push(m)

      // convert scenarios to r5 format as needed
      if (m.type === 'set-trip-phasing') {
        m.target = {
          tripId: [ m.targetTripId ],
          // hacky, frequency entry selectors are a modification type because they inherit trip selection logic from the
          // abstract trip modification. Jackson really oughtn't need this type info because there is no polymorphism here,
          // but apparently it does.
          type: 'frequency-entry-selector'
        }

        m.source = {
          tripId: [ m.sourceTripId ],
          type: 'frequency-entry-selector'
        }

        m.targetTripId = m.sourceTripId = undefined
      }
    }

    // pretty print the json
    let out = JSON.stringify(scenario, null, 2)

    let uri = `data:application/json;base64,${window.btoa(out)}`
    window.open(uri)
  }

  render () {
    return (
      <div>
        <div style={{width: '75%', height: '100%', position: 'absolute', padding: '0px'}}>
          <LeafletMap center={[39.0970, -94.6053]} zoom={12}>
            <TileLayer url='http://{s}.tiles.mapbox.com/v3/conveyal.hml987j0/{z}/{x}/{y}.png'
              attribution={'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
              'Imagery © <a href="http://mapbox.com">Mapbox</a>'} />

            {/* show patterns at the bottom */}
            {(this.props.modifications ? [...this.props.modifications.values()] : [])
              .filter((m) => m.type === 'remove-trips' && m.showOnMap)
              .map((m) => <PatternLayer data={this.props.data} modification={m} color={colors.REMOVED} />)}

            {(this.props.modifications ? [...this.props.modifications.values()] : [])
              .filter((m) => (m.type === 'adjust-speed' || m.type === 'adjust-dwell-time' || m.type === 'convert-to-frequency') && m.showOnMap)
              .map((m) => <PatternLayer data={this.props.data} modification={m} color={colors.MODIFIED} />)}

            {/* show patterns with removed stop in neutral gray, the stops themselves will be shown as red.*/}
            {(this.props.modifications ? [...this.props.modifications.values()] : [])
              .filter((m) => m.type === 'remove-stops' && m.showOnMap)
              .map((m) => <PatternLayer data={this.props.data} modification={m} color={colors.NEUTRAL} />)}
          </LeafletMap>
        </div>

        {/* side bar */}
        <div style={{position: 'fixed', right: '0px', top: '0px', height: '100%', width: '25%', padding: '0px', background: '#fff', borderLeft: '1px solid #888', zIndex: 2000, overflow: 'scroll'}}>
          <button onClick={this.exportScenario}>Export</button>

          <div>
            Project ID:<br/>
            { this.props.id ? this.props.name : <i>none selected</i> }<br/>
            <button onClick={this.openProjectSelectDialog}>Open Project</button>
          </div>

          <div>
            Graph ID:<br/>
            { this.props.bundleId ? this.props.bundleId : <i>none selected</i> }<br/>
            <button onClick={this.selectGraph}>Select graph</button>
          </div>

          <button onClick={this.openImportShapefile}>Import Shapefile</button>

          <button onClick={this.openBundleUpload}>Create new bundle</button>

          {/* display the scenario */}
          { this.props.id && this.props.bundleId ?
            <Scenario modifications={this.props.modifications} bundleId={this.props.bundleId} replaceModification={this.props.replaceModification} deleteModification={this.props.deleteModification}
              addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} data={this.props.data} /> :
            <i>select a project and graph</i> }
        </div>

        {/* project select modal */}
        {(() => {
          if (this.state.projectSelectOpen) {
            return (
              <Modal isOpen onRequestClose={this.closeProjectSelectDialog}>
                <ul>
                  {this.props.projects.map(project => <li key={project.id}><a href='#' data-project={project.id} onClick={this.selectProject}>{project.name}</a></li>)}
                </ul>

                <input type='text' placeholder='New project' value={this.state.newProjectName} onChange={this.updateNewProjectName} /><button onClick={this.createNewProject}>+</button>
              </Modal>
            )
          } else if (this.state.importShapefileOpen) {
            return <ImportShapefile replaceModification={this.props.replaceModification} close={this.closeImportShapefile} />
          } else if (this.state.bundleUploadOpen) {
            return <Modal isOpen onRequestClose={this.closeBundleUpload}>
              <UploadBundle />
            </Modal>
          } else return <span />
        })()}

      </div>
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioEditor)
