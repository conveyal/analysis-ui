
function createInitialState () {
  return {
    bundles: [],
    modifications: [],
    feeds: [],
    feedsById: {},
    projects: [],
    projectsById: {}
  }
}

export const reducers = {
  'add bundle' (state, action) {
    return {
      ...state,
      bundles: [...state.bundles, action.payload]
    }
  },
  /** add a newly created project to the state */
  'add project' (state, action) {
    const projects = [...state.projects, action.payload]
    return {
      ...state,
      projects,
      projectsById: arrayToObj(projects)
    }
  },
  'delete bundle' (state, action) {
    const id = action.payload
    const bundles = state.bundles.filter(b => b._id !== id)
    return {
      ...state,
      bundles
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
    const projectsById = {...state.projectsById}
    delete projectsById[action.payload]
    return {
      ...state,
      currentProject: undefined,
      projects: Object.values(projectsById),
      projectsById
    }
  },
  'log out' (state, action) {
    return createInitialState()
  },
  'set bundles' (state, action) {
    return {
      ...state,
      bundles: [...action.payload]
    }
  },
  'set bundle' (state, action) {
    const bundle = action.payload
    return {
      ...state,
      bundles: state.bundles.map((b) =>
        b._id === bundle._id
          ? bundle
          : b
      )
    }
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
      modifications: [...state.modifications, action.payload]
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
  'set project' (state, action) {
    if (action.payload && action.payload._id) {
      const currentProject = {...action.payload}
      const projectsById = {...state.projectsById}
      projectsById[currentProject._id] = currentProject
      return {
        ...state,
        currentProject,
        projects: Object.values(projectsById),
        projectsById
      }
    } else {
      return {
        ...state,
        currentProject: undefined
      }
    }
  },
  'set projects' (state, action) {
    const projects = action.payload
    return {
      ...state,
      projects,
      projectsById: arrayToObj(projects)
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
