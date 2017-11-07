
function createInitialState () {
  return {
    bundles: [],
    modifications: [],
    feeds: [],
    feedsById: {},
    scenarios: [],
    scenariosById: {}
  }
}

export const reducers = {
  'add bundle' (state, action) {
    return {
      ...state,
      bundles: [...state.bundles, action.payload]
    }
  },
  /** add a newly created scenario to the state */
  'add scenario' (state, action) {
    const scenarios = [...state.scenarios, action.payload]
    return {
      ...state,
      scenarios,
      scenariosById: arrayToObj(scenarios)
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
  'delete scenario' (state, action) {
    const scenariosById = {...state.scenariosById}
    delete scenariosById[action.payload]
    return {
      ...state,
      currentScenario: undefined,
      scenarios: Object.values(scenariosById),
      scenariosById
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
  'set scenario' (state, action) {
    if (action.payload && action.payload._id) {
      const currentScenario = {...action.payload}
      const scenariosById = {...state.scenariosById}
      scenariosById[currentScenario._id] = currentScenario
      return {
        ...state,
        currentScenario,
        scenarios: Object.values(scenariosById),
        scenariosById
      }
    } else {
      return {
        ...state,
        currentScenario: undefined
      }
    }
  },
  'set scenarios' (state, action) {
    const scenarios = action.payload
    return {
      ...state,
      scenarios,
      scenariosById: arrayToObj(scenarios)
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
  }
}

function arrayToObj (a) {
  const obj = {}
  for (let i = 0; i < a.length; i++) { obj[(a[i]._id || a[i].id)] = a[i] }
  return obj
}

export const initialState = createInitialState()
