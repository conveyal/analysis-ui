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
    window.localStorage.setItem(`proj-${projectId}`, JSON.stringify(project))
  }

  getProject (projectId) {
    let mods = window.localStorage.getItem(`proj-${projectId}`)
    return mods == null ? [] : JSON.parse(mods)
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
