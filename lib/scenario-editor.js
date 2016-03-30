/**
 * The main component that controls the scenario editor, and handles the map.
 */

import React, { Component, PropTypes } from 'react'
import Dock from 'react-dock'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SET_PROJECT, SET_BUNDLE, SET_USER_PROFILE, REPLACE_MODIFICATION, UPDATE_DATA, DELETE_MODIFICATION, SET_MAP_STATE, UPDATE_VARIANTS } from './action-types'
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
    updateVariants: createAction(UPDATE_VARIANTS),

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
    updateVariants: PropTypes.func.isRequired,

    // state
    data: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
    variants: PropTypes.array.isRequired,

    bundleId: PropTypes.string,
    id: PropTypes.string,
    modifications: PropTypes.object,
    name: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      dockWidth: 0.3,
      projectSelectOpen: false,
      importShapefileOpen: false
    }
  }

  openProjectSelectDialog = () => {
    this.setState(Object.assign({}, this.state, { projectSelectOpen: true }))
  }

  closeProjectSelectDialog = () => {
    this.setState(Object.assign({}, this.state, { projectSelectOpen: false }))
  }

  openImportShapefile = () => {
    this.setState(Object.assign({}, this.state, { importShapefileOpen: true }))
  }

  closeImportShapefile = () => {
    this.setState(Object.assign({}, this.state, { importShapefileOpen: false }))
  }

  updateNewProjectName = (e) => {
    this.setState(Object.assign({}, this.state, { newProjectName: e.target.value }))
  }

  openBundleUpload = (e) => {
    this.setState(Object.assign({}, this.state, { bundleUploadOpen: true }))
  }

  closeBundleUpload = (e) => {
    this.setState(Object.assign({}, this.state, { bundleUploadOpen: false }))
  }

  openChooseBundle = (e) => {
    this.setState(Object.assign({}, this.state, { chooseBundleOpen: true }))
  }

  closeChooseBundle = (e) => {
    this.setState(Object.assign({}, this.state, { chooseBundleOpen: false }))
  }

  createNewProject = () => {
    this.props.setProject({
      id: uuid.v4(),
      name: this.state.newProjectName,
      modifications: new Map(),
      variants: ['Default']
    })
    this.closeProjectSelectDialog()
  }

  selectProject = (e) => {
    store.projectStore.getProject(e.target.getAttribute('data-project'))
      .then((p) => this.props.setProject(p))
    this.closeProjectSelectDialog()
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
    const {bundleId, data, deleteModification, id, mapState, modifications, variants, name, replaceModification, updateVariants, sessionToken, setMapState, user} = this.props
    const bundle = data.bundles.find((b) => b.id === bundleId)
    const bundleName = bundle ? bundle.name : <i>none selected</i>
    const projectName = id ? name : <em>none selected</em>
    return (
      <div>
        <div
          className='Fullscreen'
          style={{
            width: `${(1 - this.state.dockWidth) * 100}%`
          }}
          >
          <ScenarioMap
            bundle={bundle}
            data={data}
            mapState={mapState}
            modifications={modifications}
            replaceModification={replaceModification}
            setMapState={setMapState}
            updateVariants={updateVariants}
            />
        </div>

        <Dock
          dimMode='none'
          fluid
          isVisible
          position='right'
          onSizeChange={(dockWidth) => {
            this.setState({dockWidth})
          }}
          size={this.state.dockWidth}
          zIndex={2499}
          >

          <div className='DockContent'>
            <legend className='DockContent-Title clearfix'>Scenario Editor
              <span className='pull-right'>
                {sessionToken && user
                  ? <button className='btn btn-sm btn-default' onClick={this.logout}>Log out {user.email}</button>
                  : <button className='btn btn-default' onClick={this.login}>Log in</button>
                }
              </span>
            </legend>

            <div className='btn-group btn-group-justified'>
              <a className='btn btn-default' onClick={this.openImportShapefile}>Import Shapefile</a>
              <a className='btn btn-default' onClick={this.openBundleUpload}>Create new bundle</a>
            </div>

            <h4 className='clearfix'>Project: {projectName} <button className='btn btn-default pull-right' onClick={this.openProjectSelectDialog}>Open Project</button></h4>

            <h4 className='clearfix'>Bundle: {bundleName} <button className='btn btn-default pull-right' onClick={this.openChooseBundle}>Select bundle</button></h4>

            {/* display the scenario */}
            {id && bundleId
              ? <Scenario
                projectName={name}
                bundleId={bundleId}
                data={data}
                deleteModification={deleteModification}
                modifications={modifications}
                variants={variants}
                updateVariants={updateVariants}
                replaceModification={replaceModification}
                setMapState={setMapState}
                />
              : <div className='alert alert-warning'>Select a project and bundle</div>
            }
          </div>
        </Dock>

        {this.renderProjectSelectModal()}
      </div>
    )
  }

  renderProjectSelectModal () {
    const {data, projects, replaceModification, setBundle} = this.props
    const {bundleUploadOpen, chooseBundleOpen, importShapefileOpen, newProjectName, projectSelectOpen} = this.state
    const projectsList = projects.map((project) => {
      const name = project.name && project.name.length > 0 ? project.name : <i>(no name)</i>
      return (
        <li key={project.id}>
          <a href='#'
            data-project={project.id}
            onClick={this.selectProject}
            >{name}</a>
        </li>
      )
    })
    if (projectSelectOpen) {
      return (
        <CommonModal
          onClose={this.closeProjectSelectDialog}
          >
          <legend>Open Project</legend>
          <ul>{projectsList}</ul>

          <form>
            <legend>Create Project</legend>
            <div className='form-group'>
              <label>Project Name </label>
              <input
                className='form-control'
                placeholder='New project'
                type='text'
                onChange={this.updateNewProjectName}
                value={newProjectName} />
            </div>
            <button className='btn btn-success' onClick={this.createNewProject}>Create</button>
          </form>
        </CommonModal>
      )
    } else if (importShapefileOpen) {
      return <ImportShapefile
        replaceModification={replaceModification}
        close={this.closeImportShapefile}
        />
    } else if (bundleUploadOpen) {
      return (
        <CommonModal
          onRequestClose={this.closeBundleUpload}
          >
          <UploadBundle />
        </CommonModal>
      )
    } else if (chooseBundleOpen) {
      return (
        <CommonModal
          onRequestClose={this.closeChooseBundle}
          >
          <ChooseBundle
            data={data}
            setBundle={(bundleId) => { setBundle(bundleId) && this.closeChooseBundle() }}
            />
        </CommonModal>
      )
    }
  }
}

const CommonModal = ({children, onRequestClose}) => {
  return <Modal isOpen onRequestClose={onRequestClose} style={{ overlay: { zIndex: 2500 } }}>{children}</Modal>
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioEditor)
