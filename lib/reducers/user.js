
export const reducers = {
  'log out' (state, action) {
    return {}
  },
  'set user' (state, action) {
    return {
      ...state,
      ...action.payload
    }
  },
  'set id token' (state, action) {
    return {
      ...state,
      idToken: action.payload
    }
  }
}

export const initialState = {
  idToken: null
}
