import {latLngBounds} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {FeatureGroup, Marker, Rectangle} from 'react-leaflet'
import {connect} from 'react-redux'

import {DEFAULT_BOUNDS, save} from './actions/project'

function mapStateToProps ({
  project
}, {
  projectId
}) {
  const currentProject = project.projectsById[projectId] || {}
  return {
    bounds: currentProject.bounds || DEFAULT_BOUNDS,
    isLoaded: !!currentProject,
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
      map.fitBounds([this.sw(), this.ne()])
    }
  }

  componentDidMount () {
    this.fitBounds()
  }

  componentDidUpdate () {
    this.fitBounds()
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

  render () {
    const {isLoaded} = this.props
    const sw = this.sw()
    const ne = this.ne()
    if (isLoaded) {
      return (
        <FeatureGroup>
          <Marker
            draggable
            onDragEnd={(e) => {
              this.saveBounds(latLngBounds(e.target.getLatLng(), ne))
            }}
            position={sw}
            />
          <Marker
            draggable
            onDragEnd={(e) => {
              this.saveBounds(latLngBounds(e.target.getLatLng(), sw))
            }}
            position={ne}
            />
          <Rectangle
            bounds={[sw, ne]}
            weight={2}
            />
        </FeatureGroup>
      )
    } else {
      return <g />
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProjectBounds)
