// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import {Body as PanelBody} from './panel'

type Props = {
  addComponentToMap(): void,
  bundle?: {
    id: string
  },
  children: any,
  id: string,
  load(string): void,
  loadBundle(string): void,
  loadModifications: ({bundleId: string, scenarioId: string}) => void,
  modifications?: any[],
  scenario?: {
    bundleId: string,
    id: string,
    name: string,
    projectId: string
  },
  setCurrentScenario(any): void
}

export default class Scenario extends Component<void, Props, void> {
  componentDidMount () {
    const {id, load} = this.props
    load(id)
  }

  componentWillUnmount () {
    this.props.setCurrentScenario()
  }

  _dropSinglePointPin = (e: Event) => {
    e.preventDefault()
    this.props.addComponentToMap()
  }

  render () {
    const {bundle, children, id, modifications, scenario} = this.props
    return scenario
      ? <div>
        <div
          className='ApplicationDockTitle'
          ><Icon type='cube' /> {scenario.name}
          <Link
            className='pull-right'
            title='Edit scenario name'
            to={`/scenarios/${id}/edit`}
            ><Icon type='gear' />
          </Link>
          <Link
            className='pull-right'
            to={`/scenarios/${id}/import-shapefile`}
            title='Import shapefile'
            ><Icon type='globe' />
          </Link>
          <Link
            className='pull-right'
            to={`/scenarios/${id}/import-modifications`}
            title='Import modifications from another scenario'
            ><Icon type='upload' />
          </Link>
        </div>
        <div className='InnerDock'>
          {bundle && modifications
            ? <div className='ScenarioContent'>{children}</div>
            : <PanelBody>Loading GTFS bundle & modifications...</PanelBody>}
        </div>
      </div>
      : <PanelBody>Loading scenario...</PanelBody>
  }
}
