/** define action types here */
let actions = {
  SET_PROJECT: 'SET_PROJECT',
  SET_GRAPH: 'SET_GRAPH',

  // Replace a modification with a new version of itself
  REPLACE_MODIFICATION: 'REPLACE_MODIFICATION',
  DELETE_MODIFICATION: 'DELETE_MODIFICATION',

  // Add and remove Leaflet layers from the map
  ADD_LAYER: 'ADD_LAYER',
  REMOVE_LAYER: 'REMOVE_LAYER',

  ADD_CONTROL: 'ADD_CONTROL',
  REMOVE_CONTROL: 'REMOVE_CONTROL',

  LOAD_PROJECTS: 'LOAD_PROJECTS',

  /** Update the data pulled in from the GTFS feed */
  UPDATE_DATA: 'UPDATE_DATA',

  // when data has been received from the graphql api
  RECEIVE_DATA: 'RECEIVE_DATA',

  /** update map state */
  SET_MAP_STATE: 'SET_MAP_STATE'
}

export let { SET_PROJECT, SET_GRAPH, REPLACE_MODIFICATION, ADD_LAYER, REMOVE_LAYER, ADD_CONTROL, REMOVE_CONTROL, LOAD_PROJECTS, DELETE_MODIFICATION, RECEIVE_DATA, UPDATE_DATA, SET_MAP_STATE } = actions

