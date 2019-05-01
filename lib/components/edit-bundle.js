import {faPlus, faSave, faTrash} from '@fortawesome/free-solid-svg-icons'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'

import message from '../message'

import {Button} from './buttons'
import Icon from './icon'
import {Group, Text} from './input'
import Select from './select'

const labelBundles = (bundles: Bundle[]) => {
  return bundles.map(b => ({
    label: `${b.name}${b.status === 'DONE' ? '' : `: ${b.status}`}`,
    value: b._id
  }))
}

export default class EditBundle extends Component {
  state = {}

  static getDerivedStateFromProps(props) {
    return {
      bundle: props.bundle,
      labeledBundles: labelBundles(props.bundles)
    }
  }

  _selectBundle = result => this.props.goToEditBundle(result.value)

  _submit = () => {
    if (this.state.bundle) {
      this.props.saveBundle(this.state.bundle)
    }
  }

  _deleteBundle = () =>
    window.confirm(message('bundle.deleteConfirmation')) &&
    this.props.deleteBundle()

  _setName = e => {
    if (e.target.value && e.target.value.length > 0) {
      this.setState({
        bundle: {
          ...this.state.bundle,
          name: `${e.target.value}`
        }
      })
    }
  }

  _setFeedName = memoize(feedId => e => {
    const {bundle} = this.state
    if (bundle && e.target.value && e.target.value.length > 0) {
      this.setState({
        bundle: {
          ...bundle,
          feeds: bundle.feeds.map(f => {
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

  render() {
    const p = this.props
    return (
      <>
        <p>{message('bundle.explanation')}</p>

        <Group>
          <Button block onClick={p.goToCreateBundle} style='success'>
            <Icon icon={faPlus} fixedWidth /> Create a bundle
          </Button>
        </Group>

        <p className='center'>{message('bundle.select')}</p>

        <Group>
          <Select
            clearable={false}
            options={this.state.labeledBundles}
            onChange={this._selectBundle}
            value={p.bundle && p.bundle._id}
          />
        </Group>

        {p.bundle && (
          <>
            <h5>{message('bundle.edit')}</h5>

            {p.bundle.status === 'PROCESSING_GTFS' && (
              <div className='alert alert-warning'>
                {message('bundle.processing')}
              </div>
            )}

            {p.bundle.status === 'ERROR' && (
              <div className='alert alert-danger'>
                {message('bundle.failure')}
                <br />
                {p.bundle.errorCode}
              </div>
            )}

            <Text
              label={message('bundle.name')}
              name='Name'
              onChange={this._setName}
              placeholder='Bundle name'
              value={p.bundle.name}
            />

            {p.bundle.feeds &&
              p.bundle.feeds.map((feed, index) => (
                <Text
                  key={feed.feedId}
                  label={`${message('bundle.feed')} #${index + 1}`}
                  onChange={this._setFeedName(feed.feedId)}
                  placeholder='Feed name'
                  value={feed.name}
                />
              ))}

            <Button
              block
              onClick={this._submit}
              title={message('bundle.save')}
              style='success'
            >
              <Icon icon={faSave} fixedWidth /> {message('bundle.save')}
            </Button>

            <Button block style='danger' onClick={this._deleteBundle}>
              <Icon icon={faTrash} fixedWidth /> {message('bundle.delete')}
            </Button>
          </>
        )}
      </>
    )
  }
}
