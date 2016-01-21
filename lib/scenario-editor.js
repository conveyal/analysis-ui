/**
 * The main component that controls the scenario editor, and handles the map.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SET_PROJECT, SET_GRAPH, REPLACE_MODIFICATION, ADD_LAYER, REMOVE_LAYER, ADD_CONTROL, REMOVE_CONTROL } from './action-types'
import Modal from 'react-modal'
import FullscreenMap from './fullscreen-map'
import projectStore from './project-store'
import Scenario from './scenario'

function mapStateToProps (state) {
  return state
}

/** Create functions that are passed to the component in props, which update the state */
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setProject: function (projectId) {
      return {
        type: SET_PROJECT,
        projectId
      }
    },

    setGraphId: function (graphId) {
      return {
        type: SET_GRAPH,
        graphId
      }
    },

    /** replace a modification */
    replaceModification: function (modification) {
      return {
        type: REPLACE_MODIFICATION,
        modification
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
    this.state = { projectSelectOpen: false }
    this.openProjectSelectDialog = this.openProjectSelectDialog.bind(this)
    this.closeProjectSelectDialog = this.closeProjectSelectDialog.bind(this)
    this.updateNewProjectName = this.updateNewProjectName.bind(this)
    this.createNewProject = this.createNewProject.bind(this)
    this.selectProject = this.selectProject.bind(this)
    this.selectGraph = this.selectGraph.bind(this)
  }

  openProjectSelectDialog () {
    this.setState(Object.assign({}, this.state, { projectSelectOpen: true }))
  }

  closeProjectSelectDialog () {
    this.setState(Object.assign({}, this.state, { projectSelectOpen: false }))
  }

  updateNewProjectName (e) {
    this.setState(Object.assign({}, this.state, { newProjectName: e.target.value }))
  }

  createNewProject () {
    this.props.setProject(this.state.newProjectName)
    this.closeProjectSelectDialog()
  }

  selectProject (e) {
    this.props.setProject(e.target.getAttribute('data-project'))
    this.closeProjectSelectDialog()
  }

  selectGraph () {
    // TODO don't ever use window.prompt. ever.
    let graphId = window.prompt('Enter graph ID')
    if (graphId) this.props.setGraphId(graphId)
  }

  render () {
    return (
      <div style={{width: '75%', height: '100%', padding: '0px'}}>
        <FullscreenMap />

        {/* side bar */}
        <div style={{position: 'fixed', right: '0px', top: '0px', height: '100%', width: '25%', padding: '0px', background: '#fff', borderLeft: '1px solid #888', zIndex: 2000}}>
          <div>
            Project ID:<br/>
            { this.props.projectId ? this.props.projectId : <i>none selected</i> }<br/>
            <button onClick={this.openProjectSelectDialog}>Open Project</button>
          </div>

          <div>
            Graph ID:<br/>
            { this.props.graphId ? this.props.graphId : <i>none selected</i> }<br/>
            <button onClick={this.selectGraph}>Select graph</button>
          </div>

          {/* display the scenario */}
          { this.props.projectId && this.props.graphId ?
            <Scenario modifications={this.props.modifications} graphId={this.props.graphId} replaceModification={this.props.replaceModification}
              addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} /> :
            <i>select a project and graph</i> }
        </div>

        {/* project select modal */}
        {(() => {
          if (this.state.projectSelectOpen) {
            return (
              <Modal isOpen onRequestClose={this.closeProjectSelectDialog}>
                <ul>
                  {projectStore.getProjects().map(project => <li key={project}><a href='#' data-project={project} onClick={this.selectProject}>{project}</a></li>)}
                </ul>

                <input type='text' placeholder='New project' value={this.state.newProjectName} onChange={this.updateNewProjectName} /><button onClick={this.createNewProject}>+</button>
              </Modal>
            )
          } else return <span />
        })()}

      </div>
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioEditor)
