const replace = predicate => replacement => element =>
  predicate(element) ? replacement : element

function createInitialState () {
  return {
    bundles: [],
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
    const bundles = state.bundles.filter(b => b.id !== id)
    return {
      ...state,
      bundles
    }
  },
  'delete modification' (state, action) {
    const modificationId = action.payload
    const modificationsById = {...state.modificationsById}
    delete modificationsById[modificationId]

    const modifications = Object.values(modificationsById)
    return {
      ...state,
      modifications,
      modificationsById,
      modificationsByType: organizeByType(modifications)
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
    const predicate = bundle => bundle.id === action.payload.id
    return {
      ...state,
      bundles: state.bundles.map(replace(predicate)(action.payload))
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
  'set active modification' (state, action) {
    return {
      ...state,
      activeModificationId: action.payload
    }
  },
  'set modification' (state, action) {
    const modification = {...action.payload}
    const modificationsById = {...state.modificationsById}
    modificationsById[modification.id] = modification
    const modifications = Object.values(modificationsById)
    return {
      ...state,
      modifications,
      modificationsById,
      modificationsByType: organizeByType(modifications)
    }
  },
  'set modifications' (state, action) {
    const modifications = action.payload
    return {
      ...state,
      modifications,
      modificationsById: arrayToObj(modifications),
      modificationsByType: organizeByType(modifications)
    }
  },
  'set scenario' (state, action) {
    if (action.payload && action.payload.id) {
      const currentScenario = {...action.payload}
      const scenariosById = {...state.scenariosById}
      scenariosById[currentScenario.id] = currentScenario
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
      modifications,
      modificationsById: arrayToObj(modifications),
      modificationsByType: organizeByType(modifications)
    }
  }
}

function arrayToObj (a) {
  const obj = {}
  for (let i = 0; i < a.length; i++) { obj[a[i].id] = a[i] }
  return obj
}

function organizeByType (modifications) {
  return modifications.reduce((modifications, modification) => {
    const {type} = modification
    if (!modifications[type]) modifications[type] = []
    modifications[type].push(modification)
    return modifications
  }, {})
}

export const initialState = createInitialState()
