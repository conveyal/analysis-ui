import {latLngBounds} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {Marker, Rectangle} from 'react-leaflet'
import {connect} from 'react-redux'

import {save} from './actions/project'

function mapStateToProps ({
  project
}, {
  projectId
}) {
  const currentProject = project.projectsById[projectId] || {}
  return {
    bounds: currentProject.bounds || {},
    isLoaded: !!currentProject.bounds,
    project: currentProject
  }
}

function mapDispatchToProps (dispatch) {
  return {
    save: (project) => dispatch(save(project))
  }
}

class EditProjectBounds extends Component {
  static propTypes = {
    bounds: PropTypes.shape({
      north: PropTypes.number,
      east: PropTypes.number,
      south: PropTypes.number,
      west: PropTypes.number
    }),
    isLoaded: PropTypes.bool.isRequired,
    project: PropTypes.object,
    save: PropTypes.func
  }

  static contextTypes = {
    map: PropTypes.object
  }

  fitBounds () {
    const {isLoaded} = this.props
    if (isLoaded) {
      const {map} = this.context
      map.fitBounds([this.sw(), this.ne()], {maxZoom: 13})
    }
  }

  _shouldResetOnClick = true
  componentDidMount () {
    this.fitBounds()
    const {map} = this.context
    map.on('click', ({latlng}) => {
      if (this._shouldResetOnClick) {
        this.saveBounds(latLngBounds(latlng, latlng))
        this._shouldResetOnClick = false
      } else {
        this.saveBounds(latLngBounds(latlng, this.ne()))
        this._shouldResetOnClick = true
      }
    })
  }

  ne () {
    const {bounds} = this.props
    const {north, east} = bounds
    return [north, east]
  }

  sw () {
    const {bounds} = this.props
    const {south, west} = bounds
    return [south, west]
  }

  saveBounds = (bounds) => {
    const {project, save} = this.props
    save({
      ...project,
      bounds: {
        north: bounds.getNorth(),
        east: bounds.getEast(),
        south: bounds.getSouth(),
        west: bounds.getWest()
      }
    })
  }

  onSwDragEnd = (e) => {
    this.saveBounds(latLngBounds(e.target.getLatLng(), this.ne()))
  }

  onNeDragEnd = (e) => {
    this.saveBounds(latLngBounds(e.target.getLatLng(), this.sw()))
  }

  render () {
    const {isLoaded} = this.props
    const sw = this.sw()
    const ne = this.ne()
    if (isLoaded) {
      return (
        <g>
          <Marker
            draggable
            onDragEnd={this.onSwDragEnd}
            position={sw}
            />
          <Marker
            draggable
            onDragEnd={this.onNeDragEnd}
            position={ne}
            />
          <Rectangle
            bounds={[sw, ne]}
            weight={2}
            />
        </g>
      )
    } else {
      return <g />
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProjectBounds)
