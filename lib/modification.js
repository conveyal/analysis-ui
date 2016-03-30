/** represents a single modification */

import React, { Component, PropTypes } from 'react'

import AddTripPattern from './add-trip-pattern'
import RemoveTrips from './remove-trips'
import RemoveStops from './remove-stops'
import AdjustSpeed from './adjust-speed'
import AdjustDwellTime from './adjust-dwell-time'
import ConvertToFrequency from './convert-to-frequency'
import SetPhasing from './set-phasing'
import AddStops from './add-stops'

export default class Modification extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    deleteModification: PropTypes.func,
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    variants: PropTypes.array
  }

  state = {
    expanded: false
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
    const {data, modification, replaceModification, setMapState} = this.props
    const {id, type} = modification
    const props = {
      data,
      key: id,
      modification,
      replaceModification,
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
    const iconName = modification.expanded ? 'minus' : 'plus'
    const showOrHide = modification.expanded ? 'Hide' : 'Show'
    const showingOnMap = modification.showOnMap ? 'success' : 'default'
    return (
      <div className='panel-heading clearfix'>
        <button className={`btn btn-sm btn-${showingOnMap}`} onClick={this.toggleMapDisplay} title='Toggle map display'><i className='fa fa-globe'></i></button>
        <strong>&nbsp;&nbsp;&nbsp;{this.props.modification.name}</strong>

        <button className='btn btn-sm btn-danger pull-right' onClick={this.delete} title='Remove modification'><i className='fa fa-close'></i></button>
        <button className='btn btn-sm btn-default pull-right' onClick={this.toggleExpand} title={`${showOrHide} modification`}><i className={`fa fa-${iconName}`}></i></button>
      </div>
    )
  }

  renderExpanded () {
    const {modification, variants} = this.props

    return (
      <div className='panel panel-default'>
        {this.renderHeading()}
        <div className='panel-body'>
          {this.renderModification()}

          <h4>Active in variants</h4>
          <ol className='Modification-chooseVariants'>
            {variants.map((v, i) => <li key={`variant-${i}-${modification.id}`}><input type='checkbox' checked={modification.variants[i]} title={v} onChange={(e) => this.setVariant(i, e.target.checked)} /></li>)}
          </ol>
        </div>
      </div>
    )
  }

  renderClosed () {
    return (
      <div className='panel panel-default'>{this.renderHeading()}</div>
    )
  }

  render () {
    return this.props.modification.expanded
      ? this.renderExpanded()
      : this.renderClosed()
  }
}
