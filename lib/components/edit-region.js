import {faSpinner, faTrash} from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import React from 'react'

import message from 'lib/message'
import reprojectCoordinates from 'lib/utils/reproject-coordinates'

import {Application, Dock} from './base'
import {Button} from './buttons'
import Icon from './icon'
import {Text} from './input'

const EditBounds = dynamic(() => import('./map/edit-bounds'), {ssr: false})
const LabelLayer = dynamic(() => import('./map/label-layer'), {ssr: false})
const Map = dynamic(() => import('./map'), {ssr: false})

const cardinalDirections = ['North', 'South', 'East', 'West']

export default class EditRegion extends React.Component {
  state = {
    error: undefined
  }

  static getDerivedStateFromProps(props) {
    return {
      saving: !!props.region.statusCode && props.region.statusCode !== 'DONE'
    }
  }

  componentWillUnmount() {
    const p = this.props

    if (!this._hasBeenDeleted) {
      p.load(p.region._id) // if changes weren't saved, fetch them back from the server
    }
  }

  onChangeDescription = e => this.onChange({description: e.target.value})
  onChangeName = e => this.onChange({name: e.target.value})

  onChange(updatedFields) {
    const {region, setLocally} = this.props

    // set it locally so that state is shared with bounds editor
    setLocally({
      ...region,
      ...updatedFields
    })
  }

  _save = () => {
    const p = this.props
    this.setState({saving: true})

    // Save will redirect back to main region page when complete
    const b = p.region.bounds
    const nw = reprojectCoordinates({lat: b.north, lon: b.west})
    const se = reprojectCoordinates({lat: b.south, lon: b.east})
    p.save({
      ...p.region,
      bounds: {
        north: nw.lat,
        west: nw.lon,
        south: se.lat,
        east: se.lon
      }
    })
  }

  _delete = () => {
    if (window.confirm(message('region.deleteConfirmation'))) {
      this._hasBeenDeleted = true
      this.props.deleteRegion()
    }
  }

  _setBoundsFor = direction => e => {
    const {bounds} = this.props.region
    const value = e.target.value
    // TODO validate bounds without using Leaflet

    this.onChange({
      bounds: {
        ...bounds,
        [direction]: value
      }
    })
  }

  _readyToCreate() {
    const {name} = this.props.region
    // TODO validate bounds without using Leaflet
    return name && name.length > 0
  }

  render() {
    const p = this.props
    const {saving} = this.state
    const readyToCreate = this._readyToCreate()
    const buttonText = saving ? (
      <>
        <Icon icon={faSpin} spin />{' '}
        {message(`region.statusCode.${p.region.statusCode}`)}
      </>
    ) : (
      message('region.editAction')
    )

    const Map = () => (
      <>
        <LabelLayer />
        <EditBounds
          bounds={p.region.bounds}
          save={bounds => this.onChange({bounds})}
        />
      </>
    )

    return (
      <Application map={Map}>
        <Dock>
          <legend>{message('region.editTitle')}</legend>
          <Text
            label={message('region.name') + '*'}
            name={message('region.name')}
            onChange={this.onChangeName}
            value={p.region.name}
          />
          <Text
            label={message('region.description')}
            name={message('region.description')}
            onChange={this.onChangeDescription}
            value={p.region.description || ''}
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
              value={p.region.bounds[direction.toLowerCase()]}
            />
          ))}

          <p>
            <em>{message('region.updatesDisabled')}</em>
          </p>

          <Button
            block
            disabled={!readyToCreate || saving}
            onClick={this._save}
            name={message('region.editAction')}
            style='success'
          >
            {buttonText}
          </Button>

          <Button block onClick={this._delete} style='danger'>
            <Icon icon={faTrash} /> {message('region.deleteAction')}
          </Button>
        </Dock>
      </Application>
    )
  }
}
