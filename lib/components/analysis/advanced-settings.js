import {FormControl, FormLabel, Select as ChakraSelect} from '@chakra-ui/core'
import lonlat from '@conveyal/lonlat'
import {faCog, faPencilAlt, faStop} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import dynamic from 'next/dynamic'
import React, {useRef, useState} from 'react'

import message from 'lib/message'

import Icon from '../icon'
import * as Panel from '../panel'
import Select from '../select'
import {Button} from '../buttons'
import {Group, NumberInput} from '../input'
import P from '../p'

import EgressModeSelector from './egress-mode-selector'

const EditBounds = dynamic(() => import('../map/edit-bounds'), {ssr: false})

/**
 * Edit the advanced parameters of an analysis.
 */
export default function AdvancedSettings(p) {
  const [customProfileRequestError, setCustomProfileRequestError] = useState()
  const _refToTextarea = useRef()

  function _saveCustomProfileRequest() {
    try {
      const json = JSON.parse(get(_refToTextarea.current, 'value'))
      p.setProfileRequest(json)
      setCustomProfileRequestError()
    } catch (e) {
      setCustomProfileRequestError(e)
    }
  }

  function set(newFields) {
    p.setProfileRequest(newFields)
  }

  // Max rides is max transfers + 1, but transfers is common usage terminology
  const setMaxTransfers = (e) => set({maxRides: parseInt(e.target.value) + 1})
  const setMonteCarloDraws = (e) =>
    set({monteCarloDraws: parseInt(e.target.value)})
  const setWalkSpeed = (e) => set({walkSpeed: parseFloat(e.target.value) / 3.6}) // km/h to m/s
  const setBikeSpeed = (e) => set({bikeSpeed: parseFloat(e.target.value) / 3.6}) // km/h to m/s
  const setMaxWalkTime = (e) => set({maxWalkTime: parseInt(e.target.value)})
  const setMaxBikeTime = (e) => set({maxBikeTime: parseInt(e.target.value)})

  const {
    bikeSpeed,
    maxRides,
    maxBikeTime,
    maxWalkTime,
    monteCarloDraws,
    walkSpeed
  } = p.profileRequest
  return (
    <Panel.Collapsible
      defaultExpanded={false}
      heading={() => (
        <>
          <Icon icon={faCog} />
          <strong> Advanced Settings</strong>
        </>
      )}
    >
      <Panel.Body>
        <div className='row'>
          <div className='col-xs-4'>
            <EgressModeSelector
              disabled={p.disabled || p.profileRequest.transitModes === ''}
              egressModes={
                p.profileRequest.transitModes !== ''
                  ? p.profileRequest.egressModes
                  : p.profileRequest.directModes
              }
              update={p.setProfileRequest}
            />
          </div>
          <div className='col-xs-4'>
            <NumberInput
              disabled={p.disabled}
              label='Walk Speed'
              value={Math.round(walkSpeed * 36) / 10}
              min={3}
              max={15}
              step={0.1}
              name='walkSpeed'
              onChange={setWalkSpeed}
              units='km/h'
            />
          </div>
          <div className='col-xs-4'>
            <NumberInput
              disabled={p.disabled}
              label='Bike Speed'
              value={Math.round(bikeSpeed * 36) / 10}
              min={5}
              max={20}
              step={0.1}
              name='bikeSpeed'
              onChange={setBikeSpeed}
              units='km/h'
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-4'>
            <NumberInput
              disabled={p.disabled}
              label={message('analysis.monteCarloDraws')}
              name='monteCarloDraws'
              value={monteCarloDraws}
              min={1}
              max={10000}
              step={1}
              onChange={setMonteCarloDraws}
            />
          </div>
          <div className='col-xs-4'>
            <NumberInput
              disabled={p.disabled}
              label='Max Walk Time'
              value={maxWalkTime}
              min={1}
              max={60}
              step={1}
              name='maxWalkTime'
              onChange={setMaxWalkTime}
              units='min'
            />
          </div>
          <div className='col-xs-4'>
            <NumberInput
              disabled={p.disabled}
              label='Max Bike Time'
              value={maxBikeTime}
              min={1}
              max={60}
              step={1}
              name='maxBikeTime'
              onChange={setMaxBikeTime}
              units='min'
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-4'>
            <NumberInput
              disabled={p.disabled}
              label={message('analysis.transfers')}
              value={maxRides - 1} // convert max rides to max transfers
              min={0}
              max={7}
              step={1}
              name='maxTransfers'
              onChange={setMaxTransfers}
            />
          </div>
          <div className='col-xs-4'>
            <FormControl isDisabled={p.disabled}>
              <FormLabel htmlFor='bikeLts'>Max Bike Traffic Stress</FormLabel>
              <ChakraSelect
                id='bikeLts'
                onChange={(v) =>
                  set({bikeTrafficStress: parseInt(v.target.value)})
                }
                value={get(p, 'bikeTrafficStress', 4)}
              >
                <option value={1}>1 - Low stress</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4 - High stress</option>
              </ChakraSelect>
            </FormControl>
          </div>
          <div className='col-xs-4'>
            <P>
              Lower time limits may apply to transfer and egress legs. See the
              user manual for more information.
            </P>
          </div>
        </div>

        <CustomBoundsSelector
          analysisBounds={p.analysisBounds}
          disabled={p.disabled}
          profileRequest={p.profileRequest}
          regionalAnalyses={p.regionalAnalyses}
          regionBounds={p.regionBounds}
          setProfileRequest={p.setProfileRequest}
        />

        <div className='row'>
          <div className='col-xs-12'>
            <Group label={message('analysis.customizeProfileRequest.label')}>
              <P>{message('analysis.customizeProfileRequest.description')}</P>
              {customProfileRequestError && (
                <div className='alert alert-danger'>
                  {message('analysis.customizeProfileRequest.error')}
                </div>
              )}
              <textarea
                className='form-control monospace'
                defaultValue={JSON.stringify(p.profileRequest, null, '\t')}
                disabled={p.disabled}
                key={JSON.stringify(p.profileRequest)}
                ref={_refToTextarea}
                rows={10}
                spellCheck={false}
              />
              <br />
              <Button
                block
                disabled={p.disabled}
                onClick={_saveCustomProfileRequest}
                style='warning'
              >
                <Icon icon={faPencilAlt} />{' '}
                {message('analysis.customizeProfileRequest.update')}
              </Button>
            </Group>
          </div>
        </div>
      </Panel.Body>
    </Panel.Collapsible>
  )
}

/**
 * Options available are:
 * 1. Bounds of the region
 * 2. Previously run analysis bounds that are different than the regions.
 * 3. Creating a "Custom Boundary"
 */
function CustomBoundsSelector(p) {
  const [editingBounds, setEditingBounds] = useState(false)
  const {profileRequest, regionBounds, regionalAnalyses} = p
  const {bounds} = profileRequest

  // figure out which is selected
  let selected
  if (!bounds || boundsEqual(bounds, regionBounds)) {
    selected = '__REGION' // special value
  } else {
    const selectedAnalysis = regionalAnalyses.find((r) =>
      boundsEqual(webMercatorBoundsToGeographic(r), bounds)
    )

    if (selectedAnalysis != null) selected = selectedAnalysis._id
    else selected = '__CUSTOM'
  }

  const options = [
    {value: '__REGION', label: message('analysis.regionalBoundsRegion')},
    ...regionalAnalyses
      .filter(
        (r) => !boundsEqual(webMercatorBoundsToGeographic(r), regionBounds)
      )
      .map(({name, _id}) => ({
        value: _id,
        label: message('analysis.regionalBoundsSame', {name})
      }))
  ]

  if (selected === '__CUSTOM') {
    // Don't allow the user to select 'Custom' - to make custom bounds, just drag the map markers
    options.push({
      value: '__CUSTOM',
      label: message('analysis.regionalBoundsCustom'),
      disabled: true
    })
  }

  function _setRegionalAnalysisBounds(e) {
    if (e.value === '__REGION') {
      p.setProfileRequest({bounds: p.regionBounds})
    } else if (p.regionalAnalyses) {
      const foundAnalyses = p.regionalAnalyses.find((r) => r._id === e.value)
      if (foundAnalyses) {
        p.setProfileRequest({
          bounds: webMercatorBoundsToGeographic(foundAnalyses)
        })
      }
    }
  }

  return (
    <Group label={message('analysis.regionalBounds')}>
      <div className='row'>
        <div className='col-xs-6'>
          <Select
            isDisabled={p.disabled}
            value={options.find((o) => o.value === selected)}
            options={options}
            onChange={_setRegionalAnalysisBounds}
          />
        </div>
        <div className='col-xs-6'>
          {editingBounds ? (
            <>
              <EditBounds
                bounds={p.analysisBounds}
                save={(bounds) => p.setProfileRequest({bounds})}
              />
              <Button
                block
                onClick={() => setEditingBounds(false)}
                style='warning'
              >
                <Icon icon={faStop} /> Stop editing bounds
              </Button>
            </>
          ) : (
            <Button
              disabled={p.disabled}
              block
              onClick={() => setEditingBounds(true)}
              style='warning'
            >
              <Icon icon={faPencilAlt} /> Set custom geographic bounds
            </Button>
          )}
        </div>
      </div>
    </Group>
  )
}

function boundsEqual(b0, b1, epsilon = 1e-6) {
  return (
    Math.abs(b0.north - b1.north) < epsilon &&
    Math.abs(b0.west - b1.west) < epsilon &&
    Math.abs(b0.east - b1.east) < epsilon &&
    Math.abs(b0.south - b1.south) < epsilon
  )
}

/**
 * Convert web mercator bounds from a regional analysis to geographic bounds.
 */
function webMercatorBoundsToGeographic({north, west, width, height, zoom}) {
  const nw = lonlat.fromPixel(
    {
      x: west + 1,
      y: north
    },
    zoom
  )
  const se = lonlat.fromPixel(
    {
      x: west + width + 1,
      y: north + height
    },
    zoom
  )
  return {
    east: se.lon,
    north: nw.lat,
    south: se.lat,
    west: nw.lon
  }
}
