/**
 * The main component that controls the scenario editor, and handles the map.
 */

import React, { Component, PropTypes } from 'react'
import Dock from 'react-dock'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Modal from 'react-modal'
import uuid from 'uuid'

import {setMapState, setUser, updateData, updateVariants} from './actions'
import { SET_PROJECT, SET_BUNDLE, REPLACE_MODIFICATION, DELETE_MODIFICATION } from './actions/types'
import {lock} from './auth0'
import {Button, Group} from './components/buttons'
import DockContentTitle from './components/dock-content-title'
import {Text} from './components/input'
import {getProject} from './project-store'
import Scenario from './scenario'
import store from './store'
import ImportShapefile from './import-shapefile'
import UploadBundle from './upload-bundle'
import transitDataSource from './transit-data-source'
import ScenarioMap from './map/scenario-map'
import ChooseBundle from './choose-bundle'
import authenticatedFetch from './utils/authenticated-fetch'
import './map.css'

function mapStateToProps (state) {
  return state
}

/** Create functions that are passed to the component in props, which update the state */
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setUser,

    setProject: function (project) {
      // fetch new data from graphql api
      transitDataSource.getDataForModifications({ modifications: [...project.modifications.values()], bundleId: project.bundleId })

      return {
        type: SET_PROJECT,
        project
      }
    },

    setBundle: function (bundleId) {
      // fetch new data from graphql api
      transitDataSource.getDataForModifications({ modifications: store.getState().modifications.values(), bundleId })

      return {
        type: SET_BUNDLE,
        payload: bundleId
      }
    },

    setMapState,
    updateVariants,
    updateData,

    /** replace a modification */
    replaceModification: function (modification) {
      // fetch new data from graphql api
      let state = store.getState()
      transitDataSource.getDataForModifications({ modifications: [...state.modifications.values(), modification], bundleId: state.bundleId })

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
  static defaultProps = {
    variants: ['Default']
  }

  static propTypes = {
    setUser: PropTypes.func,
    user: PropTypes.object,
    // actions
    setProject: PropTypes.func.isRequired,
    setBundle: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    replaceModification: PropTypes.func.isRequired,
    deleteModification: PropTypes.func.isRequired,
    updateData: PropTypes.func,
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

  state = {
    dockWidth: 0.3,
    projectSelectOpen: false,
    importShapefileOpen: false
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
    e.preventDefault()
    getProject(e.target.getAttribute('data-project'))
      .then((p) => this.props.setProject(p))
    this.closeProjectSelectDialog()
  }

  login = (e) => {
    lock.show({
      authParams: {
        scope: 'openid analyst offline_access'
      }
    },
    (err, profile, id_token, access_token, state, refresh_token) => {
      if (err) {
        window.alert(err)
        console.error(err)
      } else {
        this.props.setUser({access_token, id_token, profile, refresh_token})
      }
    })
  }

  logout = (e) => {
    this.props.setUser(null)
    lock.logout({returnTo: window.location.href})
  }

  deleteBundle = (bundleId) => {
    authenticatedFetch(`/api/bundle/${bundleId}`, { method: 'delete' })
    .then((res) => {
      let data = Object.assign({}, this.props.data, { bundles: this.props.data.bundles.filter((b) => b.id !== bundleId) })
      this.props.updateData(data)
    })
  }

  render () {
    const {bundleId, data, deleteModification, id, mapState, modifications, variants, name, replaceModification, updateVariants, setMapState, user} = this.props
    const bundle = data.bundles.find((b) => b.id === bundleId)
    const bundleName = bundle ? bundle.name : <em>No bundle</em>
    const projectName = id ? name : <em>No project</em>
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
            <DockContentTitle>
              <strong>{projectName}</strong>: {bundleName}
              {user && user.profile && user.id_token
                ? <Button className='pull-right' onClick={this.logout}>Log out</Button>
                : <Button className='pull-right' onClick={this.login}>Log in</Button>
              }
            </DockContentTitle>

            <Group justified>
              <Button onClick={this.openProjectSelectDialog}>Open Project</Button>
              <Button onClick={this.openImportShapefile}>Import Shapefile</Button>
              <Button onClick={this.openBundleUpload}>Create bundle</Button>
              <Button onClick={this.openChooseBundle}>Select bundle</Button>
            </Group>

            {/* display the scenario */}
            {id && bundleId
              ? <Scenario
                projectName={name}
                bundleId={bundleId}
                data={data}
                deleteModification={deleteModification}
                modifications={modifications}
                replaceModification={replaceModification}
                setMapState={setMapState}
                updateVariants={updateVariants}
                variants={variants}
                />
              : <div className='alert alert-info'>Select or create a project and bundle!</div>
            }
          </div>
        </Dock>

        {this.renderProjectSelectModal()}
      </div>
    )
  }

  renderProjectSelectModal () {
    const {data, projects, replaceModification, setBundle, variants} = this.props
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
            <Text
              name='Project Name'
              onChange={this.updateNewProjectName}
              value={newProjectName} />
            <Button style='success' onClick={this.createNewProject}>Create</Button>
          </form>
        </CommonModal>
      )
    } else if (importShapefileOpen) {
      return (
        <CommonModal
          onRequestClose={this.closeImportShapefile}
          >
          <ImportShapefile
            close={this.closeImportShapefile}
            variants={variants}
            replaceModification={replaceModification}
            />
        </CommonModal>
      )
    } else if (bundleUploadOpen) {
      return (
        <CommonModal
          onRequestClose={this.closeBundleUpload}
          >
          <UploadBundle close={this.closeBundleUpload} />
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
            deleteBundle={this.deleteBundle}
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
