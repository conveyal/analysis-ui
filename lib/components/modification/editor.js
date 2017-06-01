// @flow
import React, {Component} from 'react'

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
import AddTripPattern from '../../containers/add-trip-pattern'
import AdjustDwellTime from '../../containers/adjust-dwell-time'
import AdjustSpeed from '../../containers/adjust-speed'
import ConvertToFrequency from '../../containers/convert-to-frequency'
import RemoveStops from '../../containers/remove-stops'
import RemoveTrips from '../../containers/remove-trips'
import Reroute from '../../containers/reroute'
import Icon from '../icon'
import {Checkbox, Text} from '../input'
import {Body as PanelBody} from '../panel'
import messages from '../../utils/messages'

import type {MapState, Modification} from '../../types'

type Props = {
  allVariants: string[],
  bundleId: string,
  isLoaded: boolean,
  modification: Modification,
  copyModification(): void,
  removeModification(): void,
  setMapState(MapState): void,
  setModificationName(string): void,
  setModificationVariants(boolean[]): void,
  update(any): void
}

const modificationTypeToComponentMap = {
  [ADD_TRIP_PATTERN]: AddTripPattern,
  [ADJUST_DWELL_TIME]: AdjustDwellTime,
  [ADJUST_SPEED]: AdjustSpeed,
  [CONVERT_TO_FREQUENCY]: ConvertToFrequency,
  [REMOVE_STOPS]: RemoveStops,
  [REMOVE_TRIPS]: RemoveTrips,
  [REROUTE]: Reroute
}

export default class ModificationEditor extends Component<void, Props, void> {
  _onNameChange = (e: Event & {currentTarget: HTMLInputElement}) => {
    this.props.setModificationName(e.currentTarget.value)
  }

  _remove = () => {
    if (window.confirm(messages.modification.deleteConfirmation)) {
      this.props.removeModification()
    }
  }

  _setVariant = (variantIndex: number, active: boolean) => {
    const {variants} = this.props.modification

    // this is coming from a bitset on the Java side so may be of varying length
    for (let i = 0; i < variants.length; i++) {
      if (variants[i] === undefined) variants[i] = false
    }

    variants[variantIndex] = active

    this.props.setModificationVariants([...variants])
  }

  render () {
    const {
      allVariants,
      copyModification,
      isLoaded,
      modification,
      setMapState,
      update
    } = this.props
    const name = modification.name

    if (!isLoaded) {
      return <div className='ModificationDock'>
        <div className='ModificationDockTitle'>{name}</div>
        <div className='InnerDock'>
          <PanelBody>Loading...</PanelBody>
        </div>
      </div>
    }

    const Modification = modificationTypeToComponentMap[modification.type]

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
              modification={modification}
              setMapState={setMapState}
              update={update}
              />

            <Variants
              activeVariants={modification.variants}
              allVariants={allVariants}
              modificationId={modification.id}
              setVariant={this._setVariant}
              />

            <Button
              block
              onClick={copyModification}
              style='info'
              title='Copy Modification'
              ><Icon type='copy' /> Copy Modification
            </Button>
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
