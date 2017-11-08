// @flow
import React, {Component} from 'react'

import EditBounds from './edit-bounds'

import type {Bounds, Project} from '../../types'

export default class EditProjectBounds extends Component {
  props: {
    bounds: Bounds,
    isLoaded: boolean,
    project: Project,
    setLocally: (project: Project) => void
  }

  saveBounds = (bounds: Bounds) => {
    const {project, setLocally} = this.props
    setLocally({
      ...project,
      bounds
    })
  }

  render () {
    const {isLoaded, bounds} = this.props
    return isLoaded ? <EditBounds bounds={bounds} save={this.saveBounds} /> : <g />
  }
}
