import {
  faChevronLeft,
  faCopy,
  faPencilAlt,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import dynamic from 'next/dynamic'
import React from 'react'

import message from 'lib/message'

import {Button} from '../buttons'
import Collapsible from '../collapsible'
import Icon from '../icon'
import IconTip from '../icon-tip'
import InnerDock from '../inner-dock'
import {Group, Text, TextArea} from '../input'
import AllModificationsMapDisplay from '../modifications-map/display-all'
import P from '../p'

import FitBoundsButton from './fit-bounds'
import JSONEditor from './json-editor'
import ModificationType from './type'
import Variants from './variants'

// Not every modification still uses this editor. Load dynamically
const ModificationMapEdit = dynamic(() => import('../modifications-map/edit'))

// Debounce the update function for five seconds
const DEBOUNCE_MS = 10 * 1000

// Shortened version
const hasOwnProperty = (o, p) => Object.prototype.hasOwnProperty.call(o, p)

export default class ModificationEditor extends React.PureComponent {
  state = {
    showDescription: false,
    showEditName: false,
    mapState: null
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this._updateModification.flush)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this._updateModification.flush)
    // Call any debounced updates
    this._updateModification.flush()
  }

  _onNameChange = (e) => {
    this._updateLocally({name: e.currentTarget.value})
  }

  _onDescriptionChange = (e) => {
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
      this.props.removeModification(this.props.modification)
    }
  }

  _removeFeed = () => {
    const m = this.props.modification
    if (m) {
      const update = {feed: null}
      if (hasOwnProperty(m, 'routes')) m.routes = null
      if (hasOwnProperty(m, 'stops')) m.stops = null
      if (hasOwnProperty(m, 'trips')) m.trips = null
      if (hasOwnProperty(m, 'fromStop')) m.fromStop = null
      if (hasOwnProperty(m, 'toStop')) m.toStop = null
      this._updateAndRetrieveData(update)
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

  _setMapState = (mapState) => this.setState({mapState})

  _showEditModificationName = () => this.setState({showEditName: true})

  _updateAndRetrieveFeedData = (properties) => {
    this.props.updateAndRetrieveFeedData({
      ...this.props.modification,
      ...properties
    })
  }

  /**
   * Wait until changes have stopped to save to the server to prevent extra
   * saves. Pass only the props in case the nonce was updated elsewhere.
   */
  _updateModification = debounce((newProps) => {
    this.props.update({...this.props.modification, ...newProps})
  }, DEBOUNCE_MS)

  /**
   * Set locally immediately and then call a debounced save.
   */
  _updateLocally = (properties) => {
    // immediately
    this.props.updateLocally({...this.props.modification, ...properties})
    // debounce until updates have stopped for a few seconds
    this._updateModification(properties)
  }

  _copyModification = () => this.props.copyModification(this.props.modification)

  render() {
    const {allVariants, modification} = this.props
    const p = this.props
    const {projectId, regionId} = p.query || {}
    const s = this.state
    const showDescription =
      s.showDescription || get(modification, 'description')
    const {showEditName} = this.state
    const title = get(modification, 'name', 'Loading...')
    const disableAndDim = `block ${p.saveInProgress ? 'disableAndDim' : ''}`
    return (
      <>
        <AllModificationsMapDisplay isEditing={true} />

        <div className='ApplicationDockTitle'>
          <div className={p.saveInProgress ? 'disableAndDim' : ''}>
            <IconTip
              tip='Modifications'
              link={{
                to: 'modifications',
                regionId,
                projectId
              }}
              icon={faChevronLeft}
            />
            {title}
          </div>

          <div className={p.saveInProgress ? 'disableAndDim' : ''}>
            <FitBoundsButton />
            <IconTip
              className='pull-right'
              onClick={this._remove}
              tip={message('modification.deleteModification')}
              icon={faTrash}
            />
            <IconTip
              className='pull-right'
              onClick={this._copyModification}
              tip={message('modification.copyModification')}
              icon={faCopy}
            />
            <IconTip
              className='pull-right'
              onClick={this._showEditModificationName}
              tip={message('modification.editModificationName')}
              icon={faPencilAlt}
            />
          </div>
        </div>
        <InnerDock className={disableAndDim}>
          {p.feedIsLoaded ? (
            p.modification ? (
              <>
                {s.mapState && (
                  <ModificationMapEdit
                    feed={p.feed}
                    key={`mme-${p.modification._id}`}
                    mapState={s.mapState}
                    modification={p.modification}
                    setMapState={this._setMapState}
                    updateModification={this._updateLocally}
                  />
                )}

                {showEditName && (
                  <Text
                    name='Modification Name'
                    onChange={this._onNameChange}
                    value={p.modification.name}
                  />
                )}

                {showDescription && (
                  <TextArea
                    value={p.modification.description}
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

                {get(p, 'modification.routes.length') > 1 && (
                  <div className='alert alert-warning' role='alert'>
                    {message('modification.onlyOneRoute')}
                  </div>
                )}

                <ModificationType
                  mapState={s.mapState}
                  modification={modification}
                  selectedFeed={p.feed}
                  setMapState={this._setMapState}
                  type={p.modification.type}
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
              </>
            ) : (
              <P>Loading modification...</P>
            )
          ) : (
            <>
              <P>Loading modification feed...</P>
              <P>{message('modification.clearBundleInfo')}</P>
              <Button
                block
                style='warning'
                onClick={this._removeFeed}
                className='DEV'
              >
                {message('modification.clearBundleConfirm')}
              </Button>
            </>
          )}
        </InnerDock>
      </>
    )
  }
}
