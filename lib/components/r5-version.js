/** Select an R5 version, based on what is available in S3 */

import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import Select from 'react-select'

import Icon from './icon'
import messages from '../utils/messages'
import { Group } from './input'

const R5_BUCKET = 'https://r5-builds.s3.amazonaws.com'
const RELEASE_VERSION_REGEX = /^v[0-9]+\.[0-9]+\.[0-9]+$/
const VERSION_PARSE_REGEX = /^v([0-9]+).([0-9]+).([0-9]+)-?(.*)?$/

export default class R5Version extends Component {
  state = { allVersions: [], releaseVersions: [], showAllVersions: false }

  componentDidMount () {
    let { value, onChange } = this.props

    // retrieve R5 versions from S3
    fetch(R5_BUCKET)
      .then(res => res.text())
      .then(res => {
        let parser = new window.DOMParser()
        let document = parser.parseFromString(res, 'application/xml')

        let listing = [...document.querySelectorAll('Contents')]
          // get just key
          .map(item => item.querySelector('Key').childNodes[0].nodeValue)
          // don't include the main page
          .filter(item => item !== 'index.html')
          // and remove .jar
          .map(item => item.replace(/.jar$/, ''))

        listing.sort((a, b) => {
          let [, amajor, aminor, apatch, adescribe] = a.match(VERSION_PARSE_REGEX)
          let [, bmajor, bminor, bpatch, bdescribe] = b.match(VERSION_PARSE_REGEX)

          amajor = parseInt(amajor)
          bmajor = parseInt(bmajor)

          // reverse-sort, most recent at top
          if (amajor - bmajor < 0) return 1
          else if (amajor - bmajor > 0) return -1

          aminor = parseInt(aminor)
          bminor = parseInt(bminor)

          if (aminor - bminor < 0) return 1
          else if (aminor - bminor > 0) return -1

          apatch = parseInt(apatch)
          bpatch = parseInt(bpatch)

          if (apatch - bpatch < 0) return 1
          else if (apatch - bpatch > 0) return -1

          // but forward-sort the describes, why not
          else if (adescribe < bdescribe) return -1
          else if (adescribe > bdescribe) return 1
          else return 0
        })

        let releaseVersions = listing
          .filter(i => RELEASE_VERSION_REGEX.test(i))

        // if no version selected, force choosing latest version.
        if (value == null) onChange({ value: releaseVersions[0] })

        // if the version selected is not a release version, show all versions
        let showAllVersions = releaseVersions.indexOf(this.props.value) === -1 && listing.indexOf(this.props.value) > -1

        this.setState({ ...this.state, allVersions: listing, releaseVersions, showAllVersions })
      })
  }

  toggleAllVersions = () => {
    this.setState({ ...this.state, showAllVersions: !this.state.showAllVersions })
  }

  render () {
    let { releaseVersions, allVersions, showAllVersions } = this.state
    let {value, ...rest} = this.props

    return <div>
      <Group {...this.props}>
        <Select
          options={(showAllVersions ? allVersions : releaseVersions).map(v => { return { value: v, label: v } })}
          value={value}
          clearable={false}
          {...rest}
          />

        {/* toggle showing all versions */}
        <Icon
          type='flask'
          style={{ color: showAllVersions ? '#000' : '#aaa' }}
          title={showAllVersions ? messages.project.showReleaseVersions : messages.project.showAllVersions}
          ariaLabel={showAllVersions ? messages.project.showReleaseVersions : messages.project.showAllVersions}
          onClick={this.toggleAllVersions}
          />
      </Group>
    </div>
  }
}
