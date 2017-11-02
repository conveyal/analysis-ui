// @flow
import React, {Component} from 'react'

import EditBounds from './edit-bounds'

import type {Bounds, Project} from '../../types'

export default class EditProjectBounds extends Component {
  props: {
    bounds: Bounds,
    isLoaded: boolean,
    project: Project,
    saveLocally: (project: Project) => void
  }

  saveBounds = (bounds: Bounds) => {
    const {project, saveLocally} = this.props
    saveLocally({
      ...project,
      bounds
    })
  }

  render () {
    const {isLoaded, bounds} = this.props
    return isLoaded ? <EditBounds bounds={bounds} save={this.saveBounds} /> : <g />
  }
}
