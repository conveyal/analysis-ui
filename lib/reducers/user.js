import ReactGA from 'react-ga'

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
    const user = action.payload

    ReactGA.set({
      accessGroup: user.profile.analyst.group,
      email: user.profile.email
    })

    return {
      ...state,
      ...action.payload
    }
  }
}

export const initialState = {
  idToken: null
}
