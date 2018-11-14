// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import debounce from 'lodash/debounce'
import React from 'react'

import {Application, Dock, Title} from '../base'
import {Button} from '../buttons'
import {IconLink} from '../link'
import AddTripPattern from '../../containers/add-trip-pattern'
import AdjustDwellTime from '../../containers/adjust-dwell-time'
import AdjustSpeed from '../../containers/adjust-speed'
import ConvertToFrequency from '../../containers/convert-to-frequency'
import LabelLayer from '../map/label-layer'
import ModificationsMap from '../../containers/modifications-map'
import RemoveStops from '../../containers/remove-stops'
import RemoveTrips from '../../containers/remove-trips'
import Reroute from '../../containers/reroute'
import {Checkbox, Group, Text, TextArea} from '../input'
import type {MapState, Modification} from '../../types'

// Debounce the update function for five seconds
const DEBOUNCE_MS = 5 * 1000

type Props = {
  allVariants: string[],
  clearActive: () => void,
  copyModification: () => void,
  feedIsLoaded: boolean,
  modification?: Modification,
  modificationId: string,

  projectId: string,
  regionId: string,
  removeModification: () => void,
  setActive: () => void,
  setMapState: (MapState) => void,
  update: (modification: any) => void,
  updateAndRetrieveFeedData: (modification: any) => void,
  updateLocally: (modification: any) => void
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

export default class ModificationEditor extends React.Component {
  props: Props

  state = {
    showDescription: !!(this.props.modification && this.props.modification.description),
    showEditName: false
  }

  componentDidMount () {
    this.props.setActive()
  }

  componentWillUnmount () {
    this.props.clearActive()
  }

  _onNameChange = (e: Event & {currentTarget: HTMLInputElement}) => {
    this._updateLocally({name: e.currentTarget.value})
  }

  _onDescriptionChange = (e: Event & {currentTarget: HTMLInputElement}) => {
    this._updateLocally({description: e.currentTarget.value})
  }

  _onAddDescription = () => {
    this.setState({showDescription: true})
  }

  _remove = () => {
    if (window.confirm(message('modification.deleteConfirmation'))) {
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
      this._updateAndRetrieveFeedData(update)
    }
  }

  _setVariant = (variantIndex: number, active: boolean) => {
    const {modification} = this.props
    if (modification) {
      const {variants} = modification

      // this is coming from a bitset on the Java side so may be of varying length
      for (let i = 0; i < variants.length; i++) {
        if (variants[i] === undefined) variants[i] = false
      }

      variants[variantIndex] = active

      this._updateLocally({
        variants: [...variants]
      })
    }
  }

  _showEditModificationName = () => this.setState({showEditName: true})

  _updateAndRetrieveFeedData = (properties: any) => {
    this.props.updateAndRetrieveFeedData({
      ...this.props.modification,
      ...properties
    })
  }

  /**
   * Wait until changes have stopped to save to the server to prevent extra
   * saves. Pass only the props in case the nonce was updated elsewhere.
   */
  _updateModification = debounce(newProps => {
    this.props.update({...this.props.modification, ...newProps})
  }, DEBOUNCE_MS)

  /**
   * Set locally immediately and then call a debounced save.
   */
  _updateLocally = (properties: any) => {
    // immediately
    this.props.updateLocally({...this.props.modification, ...properties})
    // debounce until updates have stopped for a few seconds
    this._updateModification(properties)
  }

  _map = () => {
    const p = this.props
    return (
      <g>
        <LabelLayer />
        <ModificationsMap
          activeModification={p.modification}
          setMapState={p.setMapState}
          updateLocally={this._updateLocally}
        />
      </g>
    )
  }

  render () {
    const {
      allVariants,
      copyModification,
      feedIsLoaded,
      modification,
      projectId,
      regionId,
      setMapState
    } = this.props
    const {showDescription, showEditName} = this.state
    return (
      <Application map={this._map}>
        <Title>
          <IconLink
            title='Modifications'
            to={`/regions/${regionId}/projects/${projectId}/modifications`}
            type='chevron-left'
          />
          {modification ? modification.name : 'Loading...'}

          <IconLink
            className='pull-right'
            onClick={this._remove}
            title={message('modification.deleteModification')}
            type='trash'
          />
          <IconLink
            className='pull-right'
            onClick={copyModification}
            title={message('modification.copyModification')}
            type='copy'
          />
          <IconLink
            className='pull-right'
            onClick={this._showEditModificationName}
            title={message('modification.editModificationName')}
            type='pencil'
          />
        </Title>
        <Dock>
          {feedIsLoaded
            ? modification
              ? <div>
                {showEditName &&
                  <Text
                    name='Modification Name'
                    onChange={this._onNameChange}
                    value={modification.name}
                  />}

                {showDescription &&
                <TextArea
                  value={modification.description}
                  onChange={this._onDescriptionChange}
                  label={message('modification.description')}
                />}

                {!showDescription &&
                <Group>
                  <Button block style='info' onClick={this._onAddDescription}>
                    <Icon type='pencil' />
                    {' '}
                    {message('modification.addDescription')}
                  </Button>
                </Group>}

                {modification.routes && modification.routes.length > 1 &&
                  <div className='alert alert-warning' role='alert'>
                    {message('modification.onlyOneRoute')}
                  </div>
                }

                <ModificationType
                  modification={modification}
                  setMapState={setMapState}
                  type={modification.type}
                  update={this._updateLocally}
                  updateAndRetrieveFeedData={this._updateAndRetrieveFeedData}
                />

                <Variants
                  activeVariants={modification.variants}
                  allVariants={allVariants}
                  modificationId={modification._id}
                  setVariant={this._setVariant}
                />
              </div>
              : <p>Loading modification...</p>
            : <div>
              <p>Loading modification feed...</p>
              <p>{message('modification.clearBundleInfo')}</p>
              <Button block style='warning' onClick={this._removeFeed}><Icon type='times' /> {message('modification.clearBundleConfirm')}</Button>
            </div>}
        </Dock>
      </Application>
    )
  }
}

function Variants ({activeVariants, allVariants, modificationId, setVariant}) {
  return (
    <div>
      <h5>{message('variant.activeIn')}</h5>
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
