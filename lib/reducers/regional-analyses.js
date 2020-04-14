const createInitialState = () => ({
  analyses: [],
  grids: []
})

export const initialState = createInitialState()

export const reducers = {
  'delete regional analysis'(state, action) {
    const id = action.payload
    return {
      ...state,
      analyses: state.analyses.filter(r => r._id !== id)
    }
  },
  'set regional analyses'(state, action) {
    return {
      ...state,
      analyses: action.payload
    }
  },
  'set regional analysis grid'(state, action) {
    return {
      ...state,
      grids: [...state.grids, action.payload]
    }
  },
  'clear current region'() {
    return createInitialState()
  }
}
