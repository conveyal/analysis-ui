import sortBy from 'lodash/sortBy'

function createInitialState () {
  return {
    modifications: [],
    feeds: [],
    feedsById: {},
    projects: []
  }
}

const sortByCreatedAt = a => sortBy(a, i => -i.createdAt)

export const reducers = {
  /** add a newly created project to the state */
  'add project' (state, action) {
    return {
      ...state,
      projects: [action.payload, ...state.projects]
    }
  },
  'delete modification' (state, action) {
    const modificationId = action.payload
    return {
      ...state,
      modifications: state.modifications.filter((m) => m._id !== modificationId)
    }
  },
  'delete project' (state, action) {
    return {
      ...state,
      currentProject: undefined,
      projects: state.projects.filter(p => p._id !== action.payload)
    }
  },
  'log out' (state, action) {
    return createInitialState()
  },
  'set feeds' (state, action) {
    const feeds = action.payload || []
    return {
      ...state,
      feeds: [...feeds],
      feedsById: arrayToObj(feeds)
    }
  },
  'create modification' (state, action) {
    return {
      ...state,
      modifications: [action.payload, ...state.modifications]
    }
  },
  'create modifications' (state, action) {
    return {
      ...state,
      modifications: [...state.modifications, ...action.payload]
    }
  },
  'set active modification' (state, action) {
    return {
      ...state,
      activeModificationId: action.payload
    }
  },
  'set modification' (state, action) {
    const modification = action.payload
    return {
      ...state,
      modifications: state.modifications.map((m) =>
        m._id === modification._id
          ? modification
          : m)
    }
  },
  'set modifications' (state, action) {
    const modifications = action.payload
    return {
      ...state,
      modifications
    }
  },
  'update modification' (state, action) {
    const {_id, ...newProps} = action.payload
    return {
      ...state,
      modifications: state.modifications.map(m => m._id === _id
        ? {...m, ...newProps}
        : m)
    }
  },
  'set current project' (state, action) {
    return {
      ...state,
      currentProject: state.projects.find(p => p._id === action.payload)
    }
  },
  'set project' (state, action) {
    if (action.payload && action.payload._id) {
      const {projects} = state
      const currentProject = {...action.payload}
      return {
        ...state,
        currentProject,
        projects: sortByCreatedAt([...projects.filter(p => p._id !== currentProject._id), currentProject])
      }
    } else {
      return {
        ...state,
        currentProject: undefined
      }
    }
  },
  'set projects' (state, action) {
    return {
      ...state,
      projects: action.payload
    }
  },
  'show variant' (state, action) {
    const index = action.payload
    const modifications = state.modifications.map(modification => {
      return {
        ...modification,
        showOnMap: modification.variants[index]
      }
    })
    return {
      ...state,
      modifications
    }
  },
  'clear current region' (state, action) {
    return createInitialState()
  }
}

function arrayToObj (a) {
  const obj = {}
  for (let i = 0; i < a.length; i++) { obj[(a[i]._id || a[i].id)] = a[i] }
  return obj
}

export const initialState = createInitialState()
