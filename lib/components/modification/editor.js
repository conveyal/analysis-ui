// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import {Button} from '../buttons'
import Link from '../link'
import AddTripPattern from '../../containers/add-trip-pattern'
import AdjustDwellTime from '../../containers/adjust-dwell-time'
import AdjustSpeed from '../../containers/adjust-speed'
import ConvertToFrequency from '../../containers/convert-to-frequency'
import RemoveStops from '../../containers/remove-stops'
import RemoveTrips from '../../containers/remove-trips'
import Reroute from '../../containers/reroute'
import {Checkbox, Group, Text, TextArea} from '../input'
import {Body as PanelBody} from '../panel'
import messages from '../../utils/messages'

import type {MapState, Modification} from '../../types'

type Props = {
  allVariants: string[],
  feedIsLoaded: boolean,
  modification?: Modification,
  modificationId: string,
  scenarioId: string,

  clearActive: () => void,
  copyModification(): void,
  removeModification(): void,
  setActive: (modificationId: string) => void,
  setMapState(MapState): void,
  setModificationName(string): void,
  setModificationVariants(boolean[]): void,
  update(any): void
}

type State = {
  showDescription: boolean
}

const modificationTypeToComponentMap = {
  'add-trip-pattern': AddTripPattern,
  'adjust-dwell-time': AdjustDwellTime,
  'adjust-speed': AdjustSpeed,
  'convert-to-frequency': ConvertToFrequency,
  'remove-stops': RemoveStops,
  'remove-trips': RemoveTrips,
  reroute: Reroute
}

const ModificationType = (props) => {
  const M = modificationTypeToComponentMap[props.type]
  return <M {...props} />
}

export default class ModificationEditor extends Component<void, Props, State> {
  state = {
    showDescription: !!(this.props.modification && this.props.modification.description)
  }

  componentDidMount () {
    this.props.setActive(this.props.modificationId)
  }

  componentWillUnmount () {
    this.props.clearActive()
  }

  _onNameChange = (e: Event & {currentTarget: HTMLInputElement}) => {
    this.props.setModificationName(e.currentTarget.value)
  }

  _onDescriptionChange = (e: Event & {currentTarget: HTMLInputElement}) => {
    this.props.update({description: e.currentTarget.value})
  }

  _onAddDescription = () => {
    this.setState({showDescription: true})
  }

  _remove = () => {
    if (window.confirm(messages.modification.deleteConfirmation)) {
      this.props.removeModification()
    }
  }

  _removeFeed = () => {
    const {modification} = this.props
    if (modification) {
      const update: any = {feed: null}
      if (modification.hasOwnProperty('routes')) update.routes = null
      if (modification.hasOwnProperty('stops')) update.stops = null
      if (modification.hasOwnProperty('trips')) update.trips = null
      if (modification.hasOwnProperty('fromStop')) update.fromStop = null
      if (modification.hasOwnProperty('toStop')) update.toStop = null
      this.props.update(update)
    }
  }

  _setVariant = (variantIndex: number, active: boolean) => {
    if (this.props.modification) {
      const {variants} = this.props.modification

      // this is coming from a bitset on the Java side so may be of varying length
      for (let i = 0; i < variants.length; i++) {
        if (variants[i] === undefined) variants[i] = false
      }

      variants[variantIndex] = active

      this.props.setModificationVariants([...variants])
    }
  }

  render () {
    const {
      allVariants,
      copyModification,
      feedIsLoaded,
      modification,
      scenarioId,
      setMapState,
      update
    } = this.props
    const {showDescription} = this.state
    return (
      <div>
        <div className='ApplicationDockTitle'>
          <Link
            title='Modifications'
            to={`/scenarios/${scenarioId}`}>
            <Icon type='chevron-left' />
          </Link>
          {modification ? modification.name : 'Loading...'}

          <a
            className='pull-right'
            onClick={this._remove}
            tabIndex={0}
            title={messages.modification.deleteModification}
          >
            <Icon type='trash' />
          </a>
          <a
            className='pull-right'
            onClick={copyModification}
            tabIndex={0}
            title={messages.modification.copyModification}
          >
            <Icon type='copy' />
          </a>
        </div>
        <div className='InnerDock'>
          {feedIsLoaded
            ? modification
              ? <PanelBody>
                <Text
                  name='Modification Name'
                  onChange={this._onNameChange}
                  value={modification.name}
                  />

                {showDescription &&
                <TextArea
                  value={modification.description}
                  onChange={this._onDescriptionChange}
                  label={messages.modification.description}
                    />}

                {!showDescription &&
                <Group>
                  <Button block style='info' onClick={this._onAddDescription}>
                    <Icon type='pencil' />
                    {' '}
                    {messages.modification.addDescription}
                  </Button>
                </Group>}

                <ModificationType
                  modification={modification}
                  setMapState={setMapState}
                  type={modification.type}
                  update={update}
                  />

                <Variants
                  activeVariants={modification.variants}
                  allVariants={allVariants}
                  modificationId={modification.id}
                  setVariant={this._setVariant}
                  />
              </PanelBody>
              : <PanelBody>Loading modification...</PanelBody>
            : <PanelBody>
              <p>Loading modification feed...</p>
              <p>If you removed th selected feed from this project you will need to clear the selected feed or delete this modification.</p>
              <Button block style='warning' onClick={this._removeFeed}><Icon type='times' /> Clear selected feed</Button>
            </PanelBody>}
        </div>
      </div>
    )
  }
}

function Variants ({activeVariants, allVariants, modificationId, setVariant}) {
  return (
    <div>
      <h5>{messages.scenario.activeIn}</h5>
      <div className='form-inline'>
        {allVariants.map((v, i) => (
          <Checkbox
            checked={activeVariants[i]}
            label={i + 1}
            key={`variant-${i}-modification-${modificationId}`}
            onChange={e => setVariant(i, e.target.checked)}
            title={v}
          />
        ))}
      </div>
    </div>
  )
}
