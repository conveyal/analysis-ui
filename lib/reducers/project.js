
export const reducers = {
  'delete project' (state, action) {
    const projectsById = {...state.projectsById}
    delete projectsById[action.payload]
    return {
      ...state,
      currentProject: null,
      projects: Object.values(projectsById),
      projectsById
    }
  },
  'set project' (state, action) {
    const currentProject = {...action.payload}
    const projectsById = {...state.projectsById}
    projectsById[currentProject.id] = currentProject
    return {
      ...state,
      currentProject,
      projects: Object.values(projectsById),
      projectsById
    }
  },
  'set all projects' (state, action) {
    const projects = action.payload
    return {
      ...state,
      projects,
      projectsById: arrayToObj(projects)
    }
  },
  'set regional analyses' (state, action) {
    const regionalAnalyses = action.payload
    return {
      ...state,
      regionalAnalyses
    }
  }
}

export const initialState = {
  currentProject: null,
  projects: [],
  projectsById: {}
}

function arrayToObj (a) {
  const obj = {}
  for (let i = 0; i < a.length; i++) obj[a[i].id] = a[i]
  return obj
}
