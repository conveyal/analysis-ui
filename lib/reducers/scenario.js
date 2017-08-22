function createInitialState () {
  return {
    bundles: [],
    currentBundle: null,
    currentScenario: null,
    feeds: [],
    feedsById: {},
    modifications: null,
    modificationsById: null,
    modificationsByType: null,
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
      currentScenario: null,
      scenarios: Object.values(scenariosById),
      scenariosById
    }
  },
  'log out' (state, action) {
    return createInitialState()
  },
  'set bundle' (state, action) {
    const currentBundle = action.payload
    const {id} = currentBundle
    return {
      ...state,
      currentScenario: {
        ...state.currentScenario,
        bundleId: id
      }
    }
  },
  'set bundles' (state, action) {
    return {
      ...state,
      bundles: [...action.payload]
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
        currentScenario: null
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
  for (let i = 0; i < a.length; i++) obj[a[i].id] = a[i]
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
