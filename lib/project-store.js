/**
 * Store projects.
 * This implementation uses local storage. We'll want to switch it out for a server component at some point.
 */

// get redux store
import store from './store'

class ProjectStore {
  constructor () {
    store.subscribe(() => {
      let state = store.getState()
      // NB this won't overwrite the project when it is being loaded as the reducer for switching projects
      // loads the modifications
      if (state.projectId) this.saveProject(state.projectId, { modifications: state.modifications, graphId: state.graphId })
    })
  }

  saveProject (projectId, project) {
    let projects = window.localStorage.getItem('projects')

    // make sure that the project ID is stored
    if (projects == null) window.localStorage.setItem('projects', JSON.stringify([projectId]))
    else {
      projects = JSON.parse(projects)
      if (!projects.includes(projectId)) {
        projects.push(projectId)
        window.localStorage.setItem('projects', JSON.stringify(projects))
      }
    }

    // store the project
    // use ... to expand modifications into map, because JavaScript maps don't get serialized to JSON
    // see http://www.2ality.com/2015/08/es6-map-json.html
    window.localStorage.setItem(`proj-${projectId}`, JSON.stringify(Object.assign({}, project, { modifications: [...project.modifications] })))
  }

  getProject (projectId) {
    let mods = window.localStorage.getItem(`proj-${projectId}`)
    if (mods == null) return {}

    let parsedMods = JSON.parse(mods)
    return {
      graphId: parsedMods.graphId,
      // modifications serialized as zipped array, see above
      modifications: new Map(parsedMods.modifications)
    }
  }

  getProjects () {
    let projects = window.localStorage.getItem('projects')
    if (projects != null) return JSON.parse(projects)
    else return []
  }
}

// singleton
const projectStore = new ProjectStore()
export default projectStore
