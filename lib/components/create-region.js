import {faCheck, faMap} from '@fortawesome/free-solid-svg-icons'
import bbox from '@turf/bbox'
import dynamic from 'next/dynamic'
import React, {Component} from 'react'

import {DEFAULT_BOUNDS} from '../constants/region'
import message from '../message'
import reprojectCoordinates from '../utils/reproject-coordinates'

import {Dock, Title} from './base'
import {Button} from './buttons'
import Icon from './icon'
import {Text, File} from './input'
import Sidebar from './sidebar'

const EditBounds = dynamic(() => import('./map/edit-bounds'), {ssr: false})
const LabelLayer = dynamic(() => import('./map/label-layer'), {ssr: false})
const Map = dynamic(() => import('./map'), {ssr: false})

const cardinalDirections = ['North', 'South', 'East', 'West']

export default class CreateRegion extends Component {
  state = {
    customOpenStreetMapData: undefined,
    error: undefined,
    uploading: false,
    bounds: DEFAULT_BOUNDS,
    description: '',
    name: undefined
  }

  onChangeDescription = e => this.setState({description: e.target.value})
  onChangeName = e => this.setState({name: e.target.value})

  _changeCustomOsm = e => {
    this.setState({customOpenStreetMapData: e.target.files[0]})
  }

  _create = () => {
    // Create/save will redirect to the region status page
    this.setState({uploading: true})
    this.props.create({
      ...this.state,
      bounds: this.state.bounds // TODO: reproject all coordinates
    })
  }

  _setBoundsFor = direction => e => {
    const {bounds} = this.state
    bounds[direction] = e.target.value
    // TODO: validate bounds
    this.setState({bounds})
  }

  _readyToCreate() {
    const {bounds, customOpenStreetMapData, name} = this.state
    // TODO: validate bounds
    return customOpenStreetMapData && name && name.length > 0
  }

  render() {
    const {bounds, description, name, uploading} = this.state
    const readyToCreate = this._readyToCreate()
    return (
      <>
        <Sidebar {...this.props} />

        <div className='Fullscreen'>
          <Map>
            <LabelLayer />
            <EditBounds
              bounds={bounds}
              save={bounds => this.setState({bounds})}
            />
          </Map>
        </div>
        <div className='ApplicationDock'>
          <Title>
            <Icon icon={faMap} fixedWidth /> {message('region.createAction')}
          </Title>
          <Dock>
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
              {message('region.boundsNotice')}
              <a
                href='http://docs.analysis.conveyal.com/en/latest/analysis/methodology.html#spatial-resolution'
                target='_blank'
              >
                {' '}
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
              <Icon icon={faCheck} fixedWidth />{' '}
              {message('region.createAction')}
            </Button>
          </Dock>
        </div>
      </>
    )
  }
}
