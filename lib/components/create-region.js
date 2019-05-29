import {faCheck, faMap} from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import {withRouter} from 'next/router'
import React, {Component} from 'react'

import {RouteTo} from 'lib/constants'
import {DEFAULT_BOUNDS} from 'lib/constants/region'
import message from 'lib/message'
import reprojectCoordinates from 'lib/utils/reproject-coordinates'

import {Dock} from './base'
import {Button} from './buttons'
import Icon from './icon'
import {Text, File} from './input'
import Sidebar from './sidebar'

const EditBounds = dynamic(() => import('./map/edit-bounds'), {ssr: false})
const Map = dynamic(() => import('./map'), {ssr: false})

const cardinalDirections = ['North', 'South', 'East', 'West']

/**
 * Create a region.
 */
class CreateRegion extends Component {
  state = {
    customOpenStreetMapData: undefined,
    error: undefined,
    uploading: false,
    bounds: DEFAULT_BOUNDS,
    description: '',
    name: ''
  }

  onChangeDescription = e => this.setState({description: e.target.value})
  onChangeName = e => this.setState({name: e.target.value})

  _changeCustomOsm = e => {
    this.setState({customOpenStreetMapData: e.target.files[0]})
  }

  // Create/save will keep checking load status and redirect to the region page
  _create = () => {
    const p = this.props
    const s = this.state
    this.setState({uploading: true})

    const b = s.bounds
    const nw = reprojectCoordinates({lat: b.north, lon: b.west})
    const se = reprojectCoordinates({lat: b.south, lon: b.east})
    const bounds = {north: nw.lat, west: nw.lon, south: se.lat, east: se.lon}

    // Construct the form data object
    const formData = new window.FormData()
    formData.append(
      'region',
      JSON.stringify({
        name: s.name,
        description: s.description,
        bounds
      })
    )
    formData.append('customOpenStreetMapData', s.customOpenStreetMapData)
    p.create(formData).then(region => {
      p.router.push({
        pathname: RouteTo.projects,
        query: {regionId: region._id}
      })
    })
  }

  _setBoundsFor = direction => e => {
    const {bounds} = this.state
    this.setState({
      bounds: {
        ...bounds,
        [direction]: e.target.value
      }
    })
  }

  _readyToCreate() {
    const {customOpenStreetMapData, name} = this.state
    return customOpenStreetMapData && name && name.length > 0
  }

  render() {
    const {bounds, description, name, uploading} = this.state
    const readyToCreate = this._readyToCreate()
    return (
      <>
        <Sidebar />

        <div className='Fullscreen'>
          <Map>
            <EditBounds
              bounds={bounds}
              save={bounds => this.setState({bounds})}
            />
          </Map>
        </div>
        <div className='ApplicationDock'>
          <Dock>
            <legend>
              <Icon icon={faMap} /> {message('region.createAction')}
            </legend>
            <Text
              label={message('region.name') + '*'}
              name={message('region.name')}
              onChange={this.onChangeName}
              value={name}
            />
            <Text
              label={message('region.description')}
              name={message('region.description')}
              onChange={this.onChangeDescription}
              value={description}
            />
            <h5>{message('region.bounds')}</h5>
            <div className='alert alert-warning'>
              <p>{message('region.boundsNotice')}</p>
              <a
                href='http://docs.analysis.conveyal.com/en/latest/analysis/methodology.html#spatial-resolution'
                rel='noopener noreferrer'
                target='_blank'
              >
                Learn more about spatial resolution here.
              </a>
            </div>
            {cardinalDirections.map(direction => (
              <Text
                key={`bound-${direction}`}
                label={`${direction} bound`}
                name={`${direction} bound`}
                onChange={this._setBoundsFor(direction.toLowerCase())}
                value={bounds[direction.toLowerCase()]}
              />
            ))}
            osmconvert crop command
            <div className='alert alert-info all-copy'>
              {`osmconvert [file].pbf -b="${bounds.west}, ${bounds.south}, ${
                bounds.east
              }, ${bounds.north}" --complete-ways -o=[file]-cropped.pbf`}
            </div>
            <File
              label={message('region.customOpenStreetMapData')}
              name='customOpenStreetMapData'
              onChange={this._changeCustomOsm}
            />
            <Button
              block
              disabled={!readyToCreate || uploading}
              onClick={this._create}
              name={message('region.createAction')}
              style='success'
            >
              <Icon icon={faCheck} /> {message('region.createAction')}
            </Button>
          </Dock>
        </div>
      </>
    )
  }
}

// Expsoe next/router to the component
export default withRouter(CreateRegion)
