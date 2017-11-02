// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'
import Select from 'react-select'

import {Button} from './buttons'
import {Group, Text} from './input'
import messages from '../utils/messages'

import type {Bundle, ReactSelectResult} from '../types'

type Props = {
  bundle?: Bundle,
  bundles: Bundle[],
  isLoaded: boolean,

  goToCreateBundle: () => void,
  goToEditBundle: (id: string) => void,
  deleteBundle: () => void,
  saveBundle: (bundle: Bundle) => void
}

export default class EditBundle extends Component {
  props: Props

  state = {
    bundle: this.props.bundle
  }

  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.bundle !== this.props.bundle) {
      this.setState({
        bundle: nextProps.bundle
      })
    }
  }

  _selectBundle = (result: ReactSelectResult) =>
    this.props.goToEditBundle(result.value)

  _submit = () => {
    if (this.state.bundle) {
      this.props.saveBundle(this.state.bundle)
    }
  }

  _deleteBundle = () =>
    window.confirm(messages.bundle.deleteConfirmation) &&
    this.props.deleteBundle()

  _setName = (e: Event & {target: HTMLInputElement}) => {
    if (e.target.value && e.target.value.length > 0) {
      this.setState({
        bundle: {
          ...this.state.bundle,
          name: `${e.target.value}`
        }
      })
    }
  }

  _setFeedName = memoize(feedId => (e: Event & {target: HTMLInputElement}) => {
    const {bundle} = this.state
    if (bundle && e.target.value && e.target.value.length > 0) {
      this.setState({
        bundle: {
          ...bundle,
          feeds: bundle.feeds.map((f) => {
            if (f.feedId === feedId) {
              return {
                ...f,
                name: e.target.value
              }
            }
            return f
          })
        }
      })
    }
  })

  render () {
    const {bundle, bundles, goToCreateBundle} = this.props
    return (
      <div>
        <br />
        <p>Bundles are a collection of one or more GTFS feeds.</p>

        <Group>
          <Button
            block
            onClick={goToCreateBundle}
            style='success'
          >
            <Icon type='plus' /> Create a bundle
          </Button>
        </Group>

        <p className='center'>or select an existing one</p>

        <Group>
          <Select
            clearable={false}
            options={bundles.map(bundle => ({
              label: bundle.name,
              value: bundle.id
            }))}
            onChange={this._selectBundle}
            value={bundle && bundle.id}
          />
        </Group>

        {bundle &&
          <div>
            <h5>Edit Bundle</h5>
            <Text
              label='Bundle name'
              name='Name'
              onChange={this._setName}
              placeholder='Bundle name'
              value={bundle.name}
            />

            {bundle.feeds.map((feed, index) => (
              <Text
                key={feed.feedId}
                label={`Feed #${index + 1}`}
                onChange={this._setFeedName(feed.feedId)}
                placeholder='Feed name'
                value={feed.name}
              />
            ))}

            <Button block onClick={this._submit} title={messages.bundle.save} style='success'>
              <Icon type='save' /> {messages.bundle.save}
            </Button>

            <Button block style='danger' onClick={this._deleteBundle}>
              <Icon type='trash' /> {messages.bundle.delete}
            </Button>
          </div>}
      </div>
    )
  }
}
