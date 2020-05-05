import get from 'lodash/get'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Creatable from 'react-select/creatable'

import {Group} from 'lib/components/input'
import {selectStyles} from 'lib/components/select'
import message from 'lib/message'

import {setCurrentR5Version} from '../actions'
import {MINIMUM_R5_VERSION, RECOMMENDED_R5_VERSION} from '../constants'
import * as select from '../selectors'
import {versionToNumber} from '../utils'

// Minimum version number
const MIN_VERSION = versionToNumber(MINIMUM_R5_VERSION)

// Create a new option from the select box
const _isValidNewOption = (newOption) => {
  try {
    return versionToNumber(newOption) >= MIN_VERSION
  } catch (e) {
    console.error(e)
    return false
  }
}

const _promptTextCreator = (label) =>
  `Use "${label}" — WARNING: this will fail if this .jar does not exist on S3.`

// Wrap text in a span and style it with a line-through
const lineThrough = (text) => (
  <span style={{textDecoration: 'line-through'}}>{text}</span>
)

/**
 * Select an R5 version, based on what is available in S3
 */
export default function SelectR5Version(props) {
  const currentVersion = useSelector(select.currentVersion)
  const dispatch = useDispatch()
  const usedVersions = useSelector(select.usedVersions)

  const currentVersionNumber = versionToNumber(currentVersion)
  const lastUsedVersion = get(usedVersions, '[0].version')
  const options = [
    {
      value: RECOMMENDED_R5_VERSION,
      label: `${RECOMMENDED_R5_VERSION} (recommended)`
    }
  ]

  function _selectVersion(result) {
    const version = get(result, 'value', result)
    if (versionToNumber(version) < MIN_VERSION) {
      return window.alert(
        message('r5Version.invalidVersion', {
          version,
          minimum: MINIMUM_R5_VERSION
        })
      )
    }
    dispatch(setCurrentR5Version(version))
  }

  if (currentVersion !== RECOMMENDED_R5_VERSION) {
    options.push({
      value: currentVersion,
      label:
        currentVersionNumber < MIN_VERSION
          ? lineThrough(currentVersion)
          : currentVersion
    })
  }

  usedVersions.forEach((uv) => {
    if (
      uv.version === RECOMMENDED_R5_VERSION ||
      versionToNumber(uv.version) < MIN_VERSION
    )
      return
    options.push({
      value: uv.version,
      label: `${uv.version} — used in ${uv.name}`
    })
  })

  return (
    <>
      <Group>
        <label className='control-label' htmlFor='select-r5-version'>
          {message('r5Version.title')}
        </label>
        {currentVersionNumber < versionToNumber(RECOMMENDED_R5_VERSION) && (
          <div className='alert alert-warning'>
            {message('r5Version.latestReleaseVersionNotSelected')}
          </div>
        )}

        {lastUsedVersion && lastUsedVersion !== currentVersion && (
          <div className='alert alert-warning'>
            {message('r5Version.analysisVersionDifferent')}
          </div>
        )}

        <Creatable
          name='select-r5-version'
          inputId='select-r5-version'
          formatCreateLabel={_promptTextCreator}
          isDisabled={props.disabled}
          isValidNewOption={_isValidNewOption}
          onChange={_selectVersion}
          options={options}
          styles={selectStyles}
          value={options.find((v) => v.value === currentVersion)}
        />
      </Group>
    </>
  )
}
