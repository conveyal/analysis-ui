export const reducers = {
  'delete project' (state, action) {
    return {
      ...state,
      currentProjectId: undefined,
      projects: state.projects.filter(p => p._id !== action.payload)
    }
  },
  'set all projects' (state, action) {
    return {
      ...state,
      projects: [...action.payload]
    }
  },
  'clear current project' (state, action) {
    return {
      ...state,
      currentProjectId: undefined
    }
  },
  'set project' (state, action) {
    const project = action.payload
    const _id = project._id
    const projects = state.projects
    return {
      ...state,
      currentProjectId: _id,
      projects: [...projects.filter(p => p._id !== _id), project] // filter it out and then add it
    }
  },
  'set regional analyses' (state, action) {
    const regionalAnalyses = action.payload
    return {
      ...state,
      regionalAnalyses
    }
  },
  /**
   * mark a regional analysis as deleted locally so that it disappears immediately. It will be
   * marked as deleted on the server soon.
   */
  'delete regional analysis' (state, action) {
    const id = action.payload
    return {
      ...state,
      regionalAnalyses: state.regionalAnalyses.filter(r => r._id !== id)
    }
  },
  /** Add a bookmark to the project locally */
  'create bookmark' (state, action) {
    const project = {...state.projects.find(p => p._id === state.currentProjectId)}
    project.bookmarks = [...project.bookmarks, action.payload]
    return {
      ...state,
      projects: state.projects
        .map(p => p._id === project._id ? project : p)
    }
  },
  /** Add a newly uploaded aggregation area to the current project */
  'add aggregation area locally' (state, action) {
    const project = {...state.projects.find(p => p._id === state.currentProjectId)}
    project.aggregationAreas = [...project.aggregationAreas, action.payload]
    return {
      ...state,
      projects: state.projects
        .map(p => p._id === project._id ? project : p)
    }
  }
}

export const initialState = {
  currentProjectId: undefined,
  projects: []
}
