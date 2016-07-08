/** represents a single modification */

import React, {Component, PropTypes} from 'react'

import AddStops from './add-stops'
import AddTripPattern from './add-trip-pattern'
import AdjustDwellTime from './adjust-dwell-time'
import AdjustSpeed from './adjust-speed'
import {Button} from './components/buttons'
import ConvertToFrequency from './convert-to-frequency'
import Icon from './components/icon'
import {Checkbox} from './components/input'
import RemoveStops from './remove-stops'
import RemoveTrips from './remove-trips'
import SetPhasing from './set-phasing'

export default class Modification extends Component {
  static propTypes = {
    deleteModification: PropTypes.func.isRequired,
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setActiveModification: PropTypes.func.isRequired,
    setActiveTrips: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired
  }

  state = {
    expanded: false
  }

  setActive = () => {
    this.props.setActiveModification(this.props.modification)
  }

  delete = () => {
    this.props.deleteModification(this.props.modification.id)
  }

  toggleExpand = (e) => {
    e.preventDefault()
    this.props.replaceModification(Object.assign({}, this.props.modification, { expanded: !this.props.modification.expanded }))
  }

  toggleMapDisplay = () => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { showOnMap: !this.props.modification.showOnMap }))
  }

  setVariant (variantIndex, active) {
    const variants = [...this.props.modification.variants]

    // this is coming from a bitset on the Java side so may be of varying length
    for (let i = 0; i < active; i++) {
      if (variants[i] === undefined) variants[i] = false
    }

    variants[variantIndex] = active

    this.props.replaceModification(Object.assign({}, this.props.modification, { variants }))
  }

  renderModification () {
    const {feeds, feedsById, modification, mapState, replaceModification, setActiveTrips, setMapState} = this.props
    const {id, type} = modification
    const props = {
      feeds,
      feedsById,
      key: id,
      mapState,
      modification,
      replaceModification,
      setActiveTrips,
      setMapState
    }

    if (type === 'add-trip-pattern') {
      return <AddTripPattern {...props} />
    } else if (type === 'remove-trips') {
      return <RemoveTrips {...props} />
    } else if (type === 'remove-stops') {
      return <RemoveStops {...props} />
    } else if (type === 'adjust-speed') {
      return <AdjustSpeed {...props} />
    } else if (type === 'adjust-dwell-time') {
      return <AdjustDwellTime {...props} />
    } else if (type === 'convert-to-frequency') {
      return <ConvertToFrequency {...props} />
    } else if (type === 'add-stops') {
      return <AddStops {...props} />
    } else if (type === 'set-phasing') {
      return <SetPhasing {...props} />
    }
  }

  renderHeading () {
    const {modification} = this.props
    const iconName = modification.expanded ? 'chevron-up' : 'chevron-down'
    const showOrHide = modification.expanded ? 'Hide' : 'Show'
    const showingOnMap = modification.showOnMap ? 'info' : 'default'
    const showIcon = modification.showOnMap ? 'eye' : 'eye-slash'
    return (
      <div className='panel-heading clearfix'>
        <Button
          onClick={this.toggleMapDisplay}
          size='sm'
          style={showingOnMap}
          title='Toggle map display'
          ><Icon type={showIcon} />
        </Button>
        <strong>&nbsp;&nbsp;&nbsp;{this.props.modification.name}</strong>

        <Button
          className='pull-right'
          onClick={this.delete}
          size='sm'
          style='danger'
          title='Remove Modification'
          ><Icon type='close' />
        </Button>
        <Button
          className='pull-right'
          onClick={this.toggleExpand}
          size='sm'
          title={`${showOrHide} modification`}
          ><Icon type={iconName} />
        </Button>
      </div>
    )
  }

  renderExpanded () {
    const {modification, variants} = this.props

    return (
      <div
        className='panel panel-default'
        onFocus={this.setActive}
        >
        {this.renderHeading()}
        <div className='panel-body'>
          {this.renderModification()}

          <br />
          <legend>Active in variants</legend>
          <div className='form-inline'>
            {variants.map((v, i) => <Checkbox
              checked={modification.variants[i]}
              label={i + 1}
              key={`variant-${i}-${modification.id}`}
              onChange={(e) => this.setVariant(i, e.target.checked)}
              title={v}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  renderClosed () {
    return (
      <div
        className='panel panel-default'
        onFocus={this.setActive}
        >{this.renderHeading()}
      </div>
    )
  }

  render () {
    return this.props.modification.expanded
      ? this.renderExpanded()
      : this.renderClosed()
  }
}
