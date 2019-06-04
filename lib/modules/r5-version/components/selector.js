import message from 'lib/message'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import Creatable from 'react-select/creatable'
import {createStructuredSelector} from 'reselect'

import {Group} from 'lib/components/input'

import {setCurrentR5Version} from '../actions'
import {MINIMUM_R5_VERSION, RECOMMENDED_R5_VERSION} from '../constants'
import * as select from '../selectors'
import {versionToNumber} from '../utils'

// Minimum version number
const MIN_VERSION = versionToNumber(MINIMUM_R5_VERSION)

// Create a new option from the select box
const _isValidNewOption = newOption => {
  try {
    return versionToNumber(newOption.label) >= MIN_VERSION
  } catch (e) {
    console.error(e)
    return false
  }
}
const _newOptionCreator = custom => ({
  label: custom.label,
  value: custom.label
})
const _promptTextCreator = label =>
  `Use "${label}" — WARNING: this will fail if this .jar does not exist on S3.`

// Wrap text in a span and style it with a line-through
const lineThrough = text => (
  <span style={{textDecoration: 'line-through'}}>{text}</span>
)

/**
 * Select an R5 version, based on what is available in S3
 */
export class SelectR5Version extends Component {
  _selectVersion = result => {
    if (!result || !result.value) return
    if (versionToNumber(result.value) < MIN_VERSION) {
      return window.alert(
        message('r5Version.invalidVersion', {
          version: result.value,
          minimum: MINIMUM_R5_VERSION
        })
      )
    }
    this.props.setCurrentR5Version(result.value)
  }

  render() {
    const {currentVersion, usedVersions} = this.props

    const options = [
      {
        value: RECOMMENDED_R5_VERSION,
        label: `${RECOMMENDED_R5_VERSION} (recommended)`
      }
    ]

    if (currentVersion !== RECOMMENDED_R5_VERSION) {
      options.push({
        value: currentVersion,
        label:
          versionToNumber(currentVersion) < MIN_VERSION
            ? lineThrough(currentVersion)
            : currentVersion
      })
    }

    usedVersions.forEach(uv => {
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
      <div>
        <Group label={message('r5Version.title')}>
          <Creatable
            clearable={false}
            isValidNewOption={_isValidNewOption}
            newOptionCreator={_newOptionCreator}
            onChange={this._selectVersion}
            options={options}
            promptTextCreator={_promptTextCreator}
            value={currentVersion}
          />
        </Group>

        {versionToNumber(currentVersion) <
          versionToNumber(RECOMMENDED_R5_VERSION) && (
          <div className='alert alert-warning'>
            {message('r5Version.latestReleaseVersionNotSelected')}
          </div>
        )}

        {usedVersions.length > 0 &&
          usedVersions[0].version !== currentVersion && (
            <div className='alert alert-warning'>
              {message('r5Version.analysisVersionDifferent')}
            </div>
          )}
      </div>
    )
  }
}

export default connect(
  createStructuredSelector(select),
  {
    setCurrentR5Version
  }
)(SelectR5Version)
