export const reducers = {
  'log out' (state, action) {
    return {}
  },
  'set id token' (state, action) {
    return {
      ...state,
      idToken: action.payload
    }
  },
  'set user' (state, action) {
    return {
      ...state,
      ...action.payload
    }
  }
}

export const initialState = {
  idToken: null
}
