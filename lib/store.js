/** Manage the Redux store */

import { createStore } from 'redux'
import { SET_PROJECT, SET_GRAPH, REPLACE_MODIFICATION, ADD_LAYER, REMOVE_LAYER, ADD_CONTROL, REMOVE_CONTROL } from './action-types'
import projectStore from './project-store'
import L from 'leaflet'

// set up the basemap
let initialState = {
  layers: new Map([['basemap',
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/conveyal.hml987j0/{z}/{x}/{y}@2x.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      detectRetina: true
    })]]),
  controls: new Map()
}

/** the main reducer */
function reduce (state = initialState, action) {
  if (action.type === SET_PROJECT) {
    state = Object.assign({}, state, { projectId: action.projectId })
    // load modifications (sync because it's using localStorage for now)
    let project = projectStore.getProject(state.projectId)
    state.modifications = project.modifications
    state.graphId = project.graphId
  } else if (action.type === SET_GRAPH) {
    state = Object.assign({}, state, { graphId: action.graphId })
  } else if (action.type === REPLACE_MODIFICATION) {
    // clone modifications
    state = Object.assign({}, state, { modifications: new Map([...state.modifications]) })
    state.modifications.set(action.modification.id, action.modification)
  } else if (action.type === ADD_LAYER) {
    state = Object.assign({}, state, { layers: new Map([...state.layers]) })
    state.layers.set(action.layerId, action.layer)
  } else if (action.type === REMOVE_LAYER) {
    state = Object.assign({}, state, { layers: new Map([...state.layers]) })
    state.layers.delete(action.layerId)
  } else if (action.type === ADD_CONTROL) {
    state = Object.assign({}, state, { controls: new Map([...state.controls]) })
    state.controls.set(action.controlId, action.control)
  } else if (action.type === REMOVE_CONTROL) {
    state = Object.assign({}, state, { controls: new Map([...state.controls]) })
    state.controls.delete(action.controlId)
  }

  return state
}

let store = createStore(reduce)

// debug: log state changes
store.subscribe(() => console.log(store.getState()))

export default store
