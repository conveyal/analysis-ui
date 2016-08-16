import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {setActiveTrips, setMapState} from './actions'
import {deleteModification, setAndRetrieveData} from './actions/modifications'
import AddTripPattern from './add-trip-pattern'
import AdjustDwellTime from './adjust-dwell-time'
import AdjustSpeed from './adjust-speed'
import {Button} from './components/buttons'
import ConvertToFrequency from './convert-to-frequency'
import Icon from './components/icon'
import {Checkbox, Text} from './components/input'
import {Body as PanelBody} from './components/panel'
import RemoveStops from './remove-stops'
import RemoveTrips from './remove-trips'
import Reroute from './reroute'
import * as types from './utils/modification-types'

function mapStateToProps ({
  mapState,
  scenario
}, {
  modification
}) {
  return {
    allVariants: scenario.variants,
    bundleId: scenario.currentScenario.bundleId,
    modification: modification,
    name: modification.name,
    type: modification.type,
    variants: modification.variants,

    // For sub-components
    feeds: scenario.feeds,
    feedsById: scenario.feedsById,
    mapState
  }
}

function mapDispatchToProps (dispatch, {
  modification
}) {
  return {
    remove: () => dispatch(deleteModification(modification.id)),
    replace: (opts) => dispatch(setAndRetrieveData(opts)),

    // for sub-components
    setActiveTrips: (opts) => dispatch(setActiveTrips(opts)),
    setMapState: (opts) => dispatch(setMapState(opts))
  }
}

class ModificationDock extends Component {
  static propTypes = {
    allVariants: PropTypes.array.isRequired,
    bundleId: PropTypes.string.isRequired,
    modification: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    variants: PropTypes.array.isRequired,

    // TODO: verify these are required for sub-components and remove if not needed
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    setActiveTrips: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired
  }

  onNameChange = (e) => {
    this.update({name: e.target.value})
  }

  replaceModification = (modification) => {
    const {bundleId, replace} = this.props
    replace({bundleId, modification})
  }

  update = (properties) => {
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

    this.update({variants: [...variants]})
  }

  render () {
    const {allVariants, feeds, feedsById, modification, mapState, name, setActiveTrips, setMapState, type, variants} = this.props
    const props = {
      feeds,
      feedsById,
      mapState,
      modification,
      replaceModification: this.replaceModification,
      setActiveTrips,
      setMapState,
      update: this.update
    }
    const ModificationType = getComponentForType(type)
    return (
      <div className='ModificationDock'>
        <div className='ModificationDockTitle'>{name}</div>
        <div className='InnerDock'>
          <PanelBody>
            <Text
              name='Name'
              onChange={this.onNameChange}
              value={name}
              />

            <ModificationType {...props} />

            <br />
            <legend>Active in variants</legend>
            <div className='form-inline'>
              {allVariants.map((v, i) => <Checkbox
                checked={variants[i]}
                label={i + 1}
                key={`variant-${i}-modification-${modification.id}`}
                onChange={(e) => this.setVariant(i, e.target.checked)}
                title={v}
                />
              )}
              <Button
                block
                className='pull-right'
                onClick={this.props.remove}
                style='danger'
                title='Delete Modification'
                ><Icon type='close' /> Delete Modification
              </Button>
            </div>
          </PanelBody>
        </div>
      </div>
    )
  }
}

function getComponentForType (type) {
  switch (type) {
    case types.ADD_TRIP_PATTERN:
      return AddTripPattern
    case types.REMOVE_TRIPS:
      return RemoveTrips
    case types.REMOVE_STOPS:
      return RemoveStops
    case types.ADJUST_SPEED:
      return AdjustSpeed
    case types.ADJUST_DWELL_TIME:
      return AdjustDwellTime
    case types.CONVERT_TO_FREQUENCY:
      return ConvertToFrequency
    case types.ADD_STOPS:
    case types.REROUTE:
      return Reroute
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationDock)
