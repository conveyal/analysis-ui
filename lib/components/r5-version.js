/** Select an R5 version, based on what is available in S3 */

import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import Select from 'react-select'

import Icon from './icon'
import messages from '../utils/messages'
import { Group } from './input'

let R5_BUCKET = 'https://r5-builds.s3.amazonaws.com'
let RELEASE_VERSION_REGEX = /^v[0-9]+\.[0-9]+\.[0-9]+$/

export default class R5Version extends Component {
  state = { allVersions: [], releaseVersions: [], showAllVersions: false }

  componentDidMount () {
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

        let releaseVersions = listing
          .filter(i => RELEASE_VERSION_REGEX.test(i))

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

    return <div>
      <Group {...this.props}>
        <Select
          options={(showAllVersions ? allVersions : releaseVersions).map(v => { return { value: v, label: v } })}
          {...this.props}
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
