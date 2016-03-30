/**
 * The main component that controls the scenario editor, and handles the map.
 */

import React, { Component, PropTypes } from 'react'
import Dock from 'react-dock'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SET_PROJECT, SET_BUNDLE, SET_USER_PROFILE, REPLACE_MODIFICATION, UPDATE_DATA, DELETE_MODIFICATION, SET_MAP_STATE } from './action-types'
import Modal from 'react-modal'
import uuid from 'uuid'
import {lock} from './auth0'
import Scenario from './scenario'
import store from './store'
import ImportShapefile from './import-shapefile'
import UploadBundle from './upload-bundle'
import getDataForModifications from './get-data-for-modifications'
import { createAction } from 'redux-actions'
import ScenarioMap from './map/scenario-map'
import ChooseBundle from './choose-bundle'
import convertToR5Modification from './export/export'
import './map.css'

function mapStateToProps (state) {
  return state
}

/** update data from the graphql API */
const updateData = createAction(UPDATE_DATA)

/** Create functions that are passed to the component in props, which update the state */
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setUserProfile: createAction(SET_USER_PROFILE),

    setProject: function (project) {
      // fetch new data from graphql api
      getDataForModifications({ modifications: [...project.modifications.values()], bundleId: project.bundleId })
        .then((data) => dispatch(updateData(data)))

      return {
        type: SET_PROJECT,
        project
      }
    },

    setBundle: function (bundleId) {
      // fetch new data from graphql api
      getDataForModifications({ modifications: store.getState().modifications.values(), bundleId })
        .then((data) => dispatch(updateData(data)))
      return {
        type: SET_BUNDLE,
        payload: bundleId
      }
    },

    setMapState: createAction(SET_MAP_STATE),

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
    }
  }, dispatch)
}

class ScenarioEditor extends Component {
  static propTypes = {
    sessionToken: PropTypes.string,
    setUserProfile: PropTypes.func,
    user: PropTypes.object,
    // actions
    setProject: PropTypes.func.isRequired,
    setBundle: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    replaceModification: PropTypes.func.isRequired,
    deleteModification: PropTypes.func.isRequired,

    // state
    data: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,

    bundleId: PropTypes.string,
    id: PropTypes.string,
    modifications: PropTypes.object,
    name: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = { projectSelectOpen: false, importShapefileOpen: false }
    this.openProjectSelectDialog = this.openProjectSelectDialog.bind(this)
    this.closeProjectSelectDialog = this.closeProjectSelectDialog.bind(this)
    this.openImportShapefile = this.openImportShapefile.bind(this)
    this.closeImportShapefile = this.closeImportShapefile.bind(this)
    this.openBundleUpload = this.openBundleUpload.bind(this)
    this.closeBundleUpload = this.closeBundleUpload.bind(this)
    this.openChooseBundle = this.openChooseBundle.bind(this)
    this.closeChooseBundle = this.closeChooseBundle.bind(this)
    this.updateNewProjectName = this.updateNewProjectName.bind(this)
    this.createNewProject = this.createNewProject.bind(this)
    this.selectProject = this.selectProject.bind(this)
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

  openChooseBundle (e) {
    this.setState(Object.assign({}, this.state, { chooseBundleOpen: true }))
  }

  closeChooseBundle (e) {
    this.setState(Object.assign({}, this.state, { chooseBundleOpen: false }))
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
      .then((p) => this.props.setProject(p))
    this.closeProjectSelectDialog()
  }

  /** export the scenario */
  exportScenario () {
    let modifications = [...this.props.modifications.values()].map((mod) => convertToR5Modification(mod))

    let scenario = {
      id: 0,
      // project name should probably not be at top level of props, but it is
      description: this.props.name,
      modifications
    }

    // pretty print the json
    let out = JSON.stringify(scenario, null, 2)

    let uri = `data:application/json;base64,${window.btoa(out)}`

    let a = document.createElement('a')
    a.setAttribute('href', uri)
    a.setAttribute('download', `${this.props.name.replace(/[^a-zA-Z0-9\._-]/g, '-')}.json`)
    a.click()
  }

  login = (e) => {
    lock.show((err, profile, token) => {
      if (err) {
        window.alert(err)
        console.error(err)
      } else {
        this.props.setUserProfile({profile, token})
      }
    })
  }

  logout = (e) => {
    this.props.setUserProfile({profile: null, token: null})
    lock.logout({returnTo: window.location.href})
  }

  render () {
    return (
      <div>
        <div style={{width: '75%', height: '100%', position: 'absolute', padding: '0px'}}>
          <ScenarioMap modifications={this.props.modifications} bundle={this.props.data.bundles.find((b) => b.id === this.props.bundleId)} data={this.props.data} mapState={this.props.mapState}
            replaceModification={this.props.replaceModification} setMapState={this.props.setMapState} />
        </div>

        {/* side bar */}
        <Dock
          dimMode='none'
          fluid
          isVisible
          position='right'
          >

          {this.props.sessionToken && this.props.user
            ? <div>Logged in as {this.props.user.email} <button onClick={this.logout}>Log out</button></div>
            : <div><button onClick={this.login}>Log in</button></div>
          }

          <button onClick={this.exportScenario}>Export</button>
          <div>
            Project ID:<br/>
            {this.props.id ? this.props.name : <i>none selected</i>}<br/>
            <button onClick={this.openProjectSelectDialog}>Open Project</button>
          </div>

          <div>
            Bundle ID:<br/>
            {this.props.bundleId ? this.props.data.bundles.find((b) => b.id === this.props.bundleId).name : <i>none selected</i>}<br/>
            <button onClick={this.openChooseBundle}>Select bundle</button>
          </div>

          <button onClick={this.openImportShapefile}>Import Shapefile</button>

          <button onClick={this.openBundleUpload}>Create new bundle</button>

          {/* display the scenario */}
          {this.props.id && this.props.bundleId
            ? <Scenario modifications={this.props.modifications} bundleId={this.props.bundleId} replaceModification={this.props.replaceModification} deleteModification={this.props.deleteModification} setMapState={this.props.setMapState} data={this.props.data} />
            : <i>select a project and bundle</i>}
        </Dock>

        {/* project select modal */}
        {(() => {
          if (this.state.projectSelectOpen) {
            return (
              <Modal isOpen onRequestClose={this.closeProjectSelectDialog}>
                <ul>
                  {this.props.projects.map((project) => <li key={project.id}><a href='#' data-project={project.id} onClick={this.selectProject}>{project.name && project.name.length > 0 ? project.name : <i>(no name)</i>}</a></li>)}
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
          } else if (this.state.chooseBundleOpen) {
            return <Modal isOpen onRequestClose={this.closeChooseBundle} >
              <ChooseBundle setBundle={(bundleId) => { this.props.setBundle(bundleId); this.closeChooseBundle() }} data={this.props.data} />
            </Modal>
          } else return <span />
        })()}

      </div>
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioEditor)
