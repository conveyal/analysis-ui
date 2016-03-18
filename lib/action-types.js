/** define action types here */

const SET_PROJECT = 'SET_PROJECT'
const SET_GRAPH = 'SET_GRAPH'

// Replace a modification with a new version of itself
const REPLACE_MODIFICATION = 'REPLACE_MODIFICATION'
const DELETE_MODIFICATION = 'DELETE_MODIFICATION'

// Add and remove Leaflet layers from the map
const ADD_LAYER = 'ADD_LAYER'
const REMOVE_LAYER = 'REMOVE_LAYER'

const ADD_CONTROL = 'ADD_CONTROL'
const REMOVE_CONTROL = 'REMOVE_CONTROL'

const LOAD_PROJECTS = 'LOAD_PROJECTS'

/** Update the data pulled in from the GTFS feed */
const UPDATE_DATA = 'UPDATE_DATA'

// when data has been received from the graphql api
const RECEIVE_DATA = 'RECEIVE_DATA'

export { SET_PROJECT, SET_GRAPH, REPLACE_MODIFICATION, ADD_LAYER, REMOVE_LAYER, ADD_CONTROL, REMOVE_CONTROL, LOAD_PROJECTS, DELETE_MODIFICATION, RECEIVE_DATA, UPDATE_DATA }
