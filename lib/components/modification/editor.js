import {
  faChevronLeft,
  faCopy,
  faPencilAlt,
  faTimes,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import dynamic from 'next/dynamic'
import React from 'react'

import {Application, Dock, Title} from '../base'
import {Button} from '../buttons'
import Collapsible from '../collapsible'
import Icon, {IconTip} from '../icon'
import {RouteTo} from '../../constants'
import AddTripPattern from '../../containers/add-trip-pattern'
import AdjustDwellTime from '../../containers/adjust-dwell-time'
import AdjustSpeed from '../../containers/adjust-speed'
import ConvertToFrequency from '../../containers/convert-to-frequency'
import RemoveStops from '../../containers/remove-stops'
import RemoveTrips from '../../containers/remove-trips'
import Reroute from '../../containers/reroute'
import {Group, Text, TextArea} from '../input'
import message from '../../message'

import JSONEditor from './json-editor'
import Variants from './variants'

const LabelLayer = dynamic(() => import('../map/label-layer'), {ssr: false})
const ModificationsMap = dynamic(
  () => import('../../containers/modifications-map'),
  {ssr: false}
)

// Debounce the update function for five seconds
const DEBOUNCE_MS = 10 * 1000

const getComponentForType = type => {
  switch (type) {
    case 'add-trip-pattern':
      return AddTripPattern
    case 'adjust-dwell-time':
      return AdjustDwellTime
    case 'adjust-speed':
      return AdjustSpeed
    case 'convert-to-frequency':
      return ConvertToFrequency
    case 'remove-stops':
      return RemoveStops
    case 'remove-trips':
      return RemoveTrips
    case 'reroute':
      return Reroute
  }
}

const ModificationType = props => {
  const M = getComponentForType(props.type)
  return M ? <M {...props} /> : <div />
}

export default class ModificationEditor extends React.Component {
  state = {
    showDescription: false,
    showEditName: false
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this._updateModification.flush)
    this.props.setActive()
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this._updateModification.flush)
    // Call any debounced updates
    this._updateModification.flush()
    // Clear the active modification id
    this.props.clearActive()
  }

  _onNameChange = e => {
    this._updateLocally({name: e.currentTarget.value})
  }

  _onDescriptionChange = e => {
    this._updateLocally({description: e.currentTarget.value})
  }

  _onAddDescription = () => {
    this.setState({showDescription: true})
  }

  _remove = () => {
    if (window.confirm(message('modification.deleteConfirmation'))) {
      // Cancel any pending updates
      this._updateModification.cancel()
      // Delete the modification
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

  _setVariant = (variantIndex, active) => {
    const variants = get(this.props, 'modification.variants', [])

    // Could come from a bitset on the Java side so may be of varying length
    for (let i = 0; i < variants.length; i++) {
      if (variants[i] === undefined) variants[i] = false
    }

    variants[variantIndex] = active

    this._updateLocally({
      variants: [...variants]
    })
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
  _updateLocally = properties => {
    // immediately
    this.props.updateLocally({...this.props.modification, ...properties})
    // debounce until updates have stopped for a few seconds
    this._updateModification(properties)
  }

  _map = () => {
    const p = this.props
    return (
      <>
        <LabelLayer />
        <ModificationsMap
          activeModification={p.modification}
          setMapState={p.setMapState}
          updateLocally={this._updateLocally}
        />
      </>
    )
  }

  render() {
    const {
      allVariants,
      copyModification,
      feedIsLoaded,
      modification,
      projectId,
      regionId,
      saveInProgress,
      setMapState
    } = this.props
    const showDescription =
      this.state.showDescription || get(modification, 'description')
    const {showEditName} = this.state
    const title = saveInProgress
      ? 'Saving...'
      : get(modification, 'name', 'Loading...')
    const disableAndDim = saveInProgress ? 'disableAndDim' : ''
    return (
      <Application {...this.props} map={this._map}>
        <Title>
          <IconTip
            tip='Modifications'
            href={{
              pathname: RouteTo.modifications,
              query: {regionId, projectId}
            }}
            icon={faChevronLeft}
          />
          {title}

          <span className={disableAndDim}>
            <IconTip
              className='pull-right'
              onClick={this._remove}
              tip={message('modification.deleteModification')}
              icon={faTrash}
            />
            <IconTip
              className='pull-right'
              onClick={copyModification}
              tip={message('modification.copyModification')}
              icon={faCopy}
            />
            <IconTip
              className='pull-right'
              onClick={this._showEditModificationName}
              tip={message('modification.editModificationName')}
              icon={faPencilAlt}
            />
          </span>
        </Title>
        <Dock className={disableAndDim}>
          {feedIsLoaded ? (
            modification ? (
              <div>
                {showEditName && (
                  <Text
                    name='Modification Name'
                    onChange={this._onNameChange}
                    value={modification.name}
                  />
                )}

                {showDescription && (
                  <TextArea
                    name='Edit description'
                    value={modification.description}
                    onChange={this._onDescriptionChange}
                    label={message('modification.description')}
                  />
                )}

                {!showDescription && (
                  <Group>
                    <Button
                      block
                      style='info'
                      name='Add description'
                      onClick={this._onAddDescription}
                    >
                      <Icon icon={faPencilAlt} />{' '}
                      {message('modification.addDescription')}
                    </Button>
                  </Group>
                )}

                {modification.routes && modification.routes.length > 1 && (
                  <div className='alert alert-warning' role='alert'>
                    {message('modification.onlyOneRoute')}
                  </div>
                )}

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

                <Collapsible title={message('modification.customizeDirectly')}>
                  <JSONEditor
                    modification={modification}
                    save={this._updateLocally}
                  />
                </Collapsible>
              </div>
            ) : (
              <p>Loading modification...</p>
            )
          ) : (
            <div>
              <p>Loading modification feed...</p>
              <p>{message('modification.clearBundleInfo')}</p>
              <Button block style='warning' onClick={this._removeFeed}>
                <Icon icon={faTimes} />{' '}
                {message('modification.clearBundleConfirm')}
              </Button>
            </div>
          )}
        </Dock>
      </Application>
    )
  }
}
