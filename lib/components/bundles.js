// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'
import Select from 'react-select'
import type {Children} from 'react'

import {Button} from './buttons'
import {Group} from './input'
import type {Bundle, ReactSelectResult} from '../types'

type Props = {
  bundles: Bundle[],
  children?: Children,
  isLoaded: boolean,
  selectedBundleId: string,

  goToCreateBundle: () => void,
  goToEditBundle: (id: string) => void
}

export default class Bundles extends Component {
  props: Props

  _goToEditBundle = memoize(id => () => this.props.goToEditBundle(id))

  _selectBundle = (result: ReactSelectResult) =>
    this.props.goToEditBundle(result.value)

  render () {
    const {
      bundles,
      children,
      isLoaded,
      goToCreateBundle,
      selectedBundleId
    } = this.props

    return (
      <div>
        <div className='ApplicationDockTitle'>
          <Icon type='database' /> GTFS Bundles
        </div>
        <div className='InnerDock'>
          <div className='block'>
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
                value={selectedBundleId}
              />
            </Group>

            <br />

            {isLoaded && children}
          </div>
        </div>
      </div>
    )
  }
}
