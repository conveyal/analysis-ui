
export const reducers = {
  'set analysis results' (state, action) {
    return {
      ...state,
      ...action.payload
    }
  }
}

export const initialState = {

}
