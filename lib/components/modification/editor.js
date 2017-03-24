import React, {Component, PropTypes} from 'react'

import AddTripPattern from './add-trip-pattern'
import AdjustDwellTime from './adjust-dwell-time'
import AdjustSpeed from './adjust-speed'
import {Button} from '../buttons'
import {
  ADD_TRIP_PATTERN,
  ADJUST_DWELL_TIME,
  ADJUST_SPEED,
  CONVERT_TO_FREQUENCY,
  REMOVE_STOPS,
  REMOVE_TRIPS,
  REROUTE
} from '../../constants'
import ConvertToFrequency from './convert-to-frequency'
import Icon from '../icon'
import {Checkbox, Text} from '../input'
import {Body as PanelBody} from '../panel'
import RemoveStops from './remove-stops'
import RemoveTrips from './remove-trips'
import Reroute from './reroute'
import messages from '../../utils/messages'

export default class ModificationEditor extends Component {
  static propTypes = {
    allVariants: PropTypes.array.isRequired,
    bundleId: PropTypes.string.isRequired,
    feeds: PropTypes.array.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    lastStopDistanceFromStart: PropTypes.number.isRequired,
    modification: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    numberOfStops: PropTypes.number.isRequired,
    routePatterns: PropTypes.array.isRequired,
    routeStops: PropTypes.array.isRequired,
    selectedFeed: PropTypes.object,
    selectedStops: PropTypes.array.isRequired,
    segmentDistances: PropTypes.array.isRequired,
    stops: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    variants: PropTypes.array.isRequired,

    // TODO: verify these are required for sub-components and remove if not needed
    mapState: PropTypes.object.isRequired,

    remove: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    setActiveTrips: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired
  }

  _onNameChange = (e) => {
    this._update({name: e.target.value})
  }

  _remove = () => {
    if (window.confirm(messages.modification.deleteConfirmation)) {
      this.props.remove()
    }
  }

  _replaceModification = (modification) => {
    const {bundleId, replace} = this.props
    replace({bundleId, modification})
  }

  _update = (properties) => {
    const {bundleId, modification, replace} = this.props
    replace({
      bundleId,
      modification: {
        ...modification,
        ...properties
      }
    })
  }

  setVariant (variantIndex, active) {
    const {variants} = this.props

    // this is coming from a bitset on the Java side so may be of varying length
    for (let i = 0; i < active; i++) {
      if (variants[i] === undefined) variants[i] = false
    }

    variants[variantIndex] = active

    this._update({variants: [...variants]})
  }

  render () {
    const {
      allVariants,
      isLoaded,
      modification,
      name,
      variants
    } = this.props

    if (!isLoaded) {
      return <div className='ModificationDock'>
        <div className='ModificationDockTitle'>{name}</div>
      </div>
    }

    return (
      <div className='ModificationDock'>
        <div className='ModificationDockTitle'>{name}</div>
        <div className='InnerDock'>
          <PanelBody>
            <Text
              name='Modification Name'
              onChange={this._onNameChange}
              value={name}
              />

            <Modification
              {...this.props}
              replaceModification={this._replaceModification}
              update={this._update}
              />

            <Variants
              activeVariants={variants}
              allVariants={allVariants}
              modificationId={modification.id}
              setVariant={this.setVariant}
              />

            <Button
              block
              className='pull-right'
              onClick={this._remove}
              style='danger'
              title='Delete Modification'
              ><Icon type='close' /> Delete Modification
            </Button>
          </PanelBody>
        </div>
      </div>
    )
  }
}

function Modification (props) {
  switch (props.type) {
    case ADD_TRIP_PATTERN:
      return <AddTripPattern {...props} />
    case REMOVE_TRIPS:
      return <RemoveTrips {...props} />
    case REMOVE_STOPS:
      return <RemoveStops {...props} />
    case ADJUST_SPEED:
      return <AdjustSpeed {...props} />
    case ADJUST_DWELL_TIME:
      return <AdjustDwellTime {...props} />
    case CONVERT_TO_FREQUENCY:
      return <ConvertToFrequency {...props} />
    case REROUTE:
      return <Reroute {...props} />
  }
}

function Variants ({
  activeVariants,
  allVariants,
  modificationId,
  setVariant
}) {
  return <div>
    <legend>Active in variants</legend>
    <div className='form-inline'>
      {allVariants.map((v, i) => <Checkbox
        checked={activeVariants[i]}
        label={i + 1}
        key={`variant-${i}-modification-${modificationId}`}
        onChange={(e) => setVariant(i, e.target.checked)}
        title={v}
        />
      )}
    </div>
  </div>
}
