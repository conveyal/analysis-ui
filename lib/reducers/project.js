import sortBy from 'lodash/sortBy'

function createInitialState() {
  return {
    modifications: [],
    feeds: [],
    projects: []
  }
}

const sortByTypeName = a => sortBy(a, ['type', 'name'])
const sortByCreatedAt = a => sortBy(a, i => -i.createdAt)

export const reducers = {
  /** add a newly created project to the state */
  'add project'(state, action) {
    return {
      ...state,
      projects: [action.payload, ...state.projects]
    }
  },
  'delete modification'(state, action) {
    const modificationId = action.payload
    return {
      ...state,
      modifications: state.modifications.filter(m => m._id !== modificationId)
    }
  },
  'delete project'(state, action) {
    return {
      ...state,
      projects: state.projects.filter(p => p._id !== action.payload)
    }
  },
  'log out'() {
    return createInitialState()
  },
  'set feeds'(state, action) {
    const feeds = action.payload || []
    return {
      ...state,
      feeds: [...feeds]
    }
  },
  'create modification'(state, action) {
    return {
      ...state,
      modifications: sortByTypeName([action.payload, ...state.modifications])
    }
  },
  'create modifications'(state, action) {
    return {
      ...state,
      modifications: sortByTypeName([...state.modifications, ...action.payload])
    }
  },
  'set modification'(state, action) {
    const modification = action.payload
    const modifications = state.modifications.filter(
      m => m._id !== modification._id
    )
    return {
      ...state,
      modifications: sortByTypeName([...modifications, modification])
    }
  },
  'set modifications'(state, action) {
    return {
      ...state,
      modifications: sortByTypeName(action.payload)
    }
  },
  'update modification'(state, action) {
    const {_id, ...newProps} = action.payload
    return {
      ...state,
      modifications: state.modifications.map(m =>
        m._id === _id ? {...m, ...newProps} : m
      )
    }
  },
  'set project'(state, action) {
    const {projects} = state
    const currentProject = {...action.payload}
    return {
      ...state,
      projects: sortByCreatedAt([
        ...projects.filter(p => p._id !== currentProject._id),
        currentProject
      ])
    }
  },
  'set projects'(state, action) {
    return {
      ...state,
      projects: action.payload
    }
  },
  'clear current region'() {
    return createInitialState()
  }
}

export const initialState = createInitialState()
