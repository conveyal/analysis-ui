import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {setActiveTrips, setMapState} from './actions'
import {deleteModification, setActive, setAndRetrieveData} from './actions/modifications'
import AddTripPattern from './add-trip-pattern'
import AdjustDwellTime from './adjust-dwell-time'
import AdjustSpeed from './adjust-speed'
import {Button} from './components/buttons'
import DeepEqual from './components/deep-equal'
import ConvertToFrequency from './convert-to-frequency'
import Icon from './components/icon'
import {Checkbox, Text} from './components/input'
import Panel, {Body as PanelBody, Heading as PanelHeading} from './components/panel'
import RemoveStops from './remove-stops'
import RemoveTrips from './remove-trips'
import Reroute from './reroute'
import SetPhasing from './set-phasing'
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
    expanded: modification.expanded,
    modification,
    name: modification.name,
    showOnMap: modification.showOnMap,
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
    setActive: () => dispatch(setActive(modification)),

    // for sub-components
    setActiveTrips: (opts) => dispatch(setActiveTrips(opts)),
    setMapState: (opts) => dispatch(setMapState(opts))
  }
}

class Modification extends DeepEqual {
  static propTypes = {
    allVariants: PropTypes.array.isRequired,
    bundleId: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    modification: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    setActive: PropTypes.func.isRequired,
    showOnMap: PropTypes.bool.isRequired,
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
    this.replaceModification({...this.props.modification, name: e.target.value})
  }

  replaceModification = (modification) => {
    const {bundleId, replace} = this.props
    replace({bundleId, modification})
  }

  toggleExpand = (e) => {
    e.preventDefault()
    const {expanded, modification} = this.props
    this.replaceModification({
      ...modification,
      expanded: !expanded
    })
  }

  toggleMapDisplay = () => {
    const {modification, showOnMap} = this.props
    this.replaceModification({
      ...modification,
      showOnMap: !showOnMap
    })
  }

  setVariant (variantIndex, active) {
    const {modification, variants} = this.props

    // this is coming from a bitset on the Java side so may be of varying length
    for (let i = 0; i < active; i++) {
      if (variants[i] === undefined) variants[i] = false
    }

    variants[variantIndex] = active

    this.replaceModification({
      ...modification,
      variants: [...variants]
    })
  }

  renderExpanded () {
    const {allVariants, feeds, feedsById, modification, mapState, name, setActiveTrips, setMapState, type, variants} = this.props
    const props = {
      feeds,
      feedsById,
      mapState,
      modification,
      replaceModification: this.replaceModification,
      setActiveTrips,
      setMapState
    }

    const ModificationType = getComponentForType(type)

    return (
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
        </div>
      </PanelBody>
    )
  }

  render () {
    const {expanded, name, showOnMap} = this.props
    return (
      <Panel onFocus={this.props.setActive}>
        <Heading
          expanded={expanded}
          name={name}
          remove={this.props.remove}
          showOnMap={showOnMap}
          toggleExpand={this.toggleExpand}
          toggleMapDisplay={this.toggleMapDisplay}
          />
        {expanded && this.renderExpanded()}
      </Panel>
    )
  }
}

function Heading ({
  expanded,
  name,
  remove,
  showOnMap,
  toggleExpand,
  toggleMapDisplay
}) {
  const iconName = expanded ? 'chevron-up' : 'chevron-down'
  const showOrHide = expanded ? 'Hide' : 'Show'
  const showingOnMap = showOnMap ? 'info' : 'default'
  const showIcon = showOnMap ? 'eye' : 'eye-slash'
  return (
    <PanelHeading>
      <Button
        onClick={toggleMapDisplay}
        size='sm'
        style={showingOnMap}
        title='Toggle map display'
        ><Icon type={showIcon} />
      </Button>
      <strong>&nbsp;&nbsp;&nbsp;{name}</strong>

      <Button
        className='pull-right'
        onClick={remove}
        size='sm'
        style='danger'
        title='Remove Modification'
        ><Icon type='close' />
      </Button>
      <Button
        className='pull-right'
        onClick={toggleExpand}
        size='sm'
        title={`${showOrHide} modification`}
        ><Icon type={iconName} />
      </Button>
    </PanelHeading>
  )
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
    case types.SET_TRIP_PHASING:
      return SetPhasing
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modification)
