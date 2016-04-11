/** define action types here */
let actions = {
  // Replace a modification with a new version of itself
  REPLACE_MODIFICATION: 'REPLACE_MODIFICATION',
  DELETE_MODIFICATION: 'DELETE_MODIFICATION',

  // Add and remove Leaflet layers from the map
  REMOVE_LAYER: 'REMOVE_LAYER',

  ADD_CONTROL: 'ADD_CONTROL',
  REMOVE_CONTROL: 'REMOVE_CONTROL',

  // when data has been received from the graphql api
  RECEIVE_DATA: 'RECEIVE_DATA'
}

export let { REPLACE_MODIFICATION, REMOVE_LAYER, ADD_CONTROL, REMOVE_CONTROL, DELETE_MODIFICATION, RECEIVE_DATA } = actions

