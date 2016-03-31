/** define action types here */
let actions = {
  SET_USER: 'SET_USER',
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
  RECEIVE_DATA: 'RECEIVE_DATA',

  /** update map state */
  SET_MAP_STATE: 'SET_MAP_STATE',

  /** update available variants */
  UPDATE_VARIANTS: 'UPDATE_VARIANTS'
}

export let { SET_USER, SET_PROJECT, SET_BUNDLE, REPLACE_MODIFICATION, ADD_LAYER, REMOVE_LAYER, ADD_CONTROL, REMOVE_CONTROL, DELETE_MODIFICATION, RECEIVE_DATA, SET_MAP_STATE, UPDATE_VARIANTS } = actions

