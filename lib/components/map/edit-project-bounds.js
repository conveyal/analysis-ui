import PropTypes from 'prop-types'
import React, {Component} from 'react'

import EditBounds from './edit-bounds'

export default class EditProjectBounds extends Component {
  static propTypes = {
    bounds: PropTypes.shape({
      north: PropTypes.number,
      east: PropTypes.number,
      south: PropTypes.number,
      west: PropTypes.number
    }),
    isLoaded: PropTypes.bool.isRequired,
    project: PropTypes.object,
    saveLocally: PropTypes.func
  }

  saveBounds = bounds => {
    const {project, saveLocally} = this.props
    saveLocally({
      ...project,
      bounds
    })
  }

  render () {
    const {isLoaded, bounds} = this.props
    return isLoaded && <EditBounds bounds={bounds} save={this.saveBounds} />
  }
}
