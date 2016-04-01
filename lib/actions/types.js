/** define action types here */
let actions = {
  SET_PROJECT: 'SET_PROJECT',
  SET_BUNDLE: 'SET_BUNDLE',

  // Replace a modification with a new version of itself
  REPLACE_MODIFICATION: 'REPLACE_MODIFICATION',
  DELETE_MODIFICATION: 'DELETE_MODIFICATION',

  // Add and remove Leaflet layers from the map
  ADD_LAYER: 'ADD_LAYER',
  REMOVE_LAYER: 'REMOVE_LAYER',

  ADD_CONTROL: 'ADD_CONTROL',
  REMOVE_CONTROL: 'REMOVE_CONTROL',

  // when data has been received from the graphql api
  RECEIVE_DATA: 'RECEIVE_DATA'
}

export let { SET_PROJECT, SET_BUNDLE, REPLACE_MODIFICATION, ADD_LAYER, REMOVE_LAYER, ADD_CONTROL, REMOVE_CONTROL, DELETE_MODIFICATION, RECEIVE_DATA } = actions

