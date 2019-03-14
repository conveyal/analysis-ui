// @flow
import React from 'react'

import ErrorModal from './error-modal'
import InnerDock from './inner-dock'
import LabelLayer from './map/label-layer'
import Map from './map'
import Sidebar from './sidebar'

export class Application extends React.Component {
  state = {}

  componentDidCatch (error) {
    if (process.env.NODE_ENV !== 'production') {
      window.alert('Uncaught error. Check console for details.')
    }
    console.error(error)
  }

  render () {
    const p = this.props
    return (
      <div>
        <ErrorModal />
        <Sidebar />

        <div className='Fullscreen'>
          <Map>{p.map ? p.map(p) : <LabelLayer />}</Map>
        </div>

        <div className='ApplicationDock'>{p.children}</div>
      </div>
    )
  }
}

export const Title = (p: any) =>
  <div className='ApplicationDockTitle'>{p.children}</div>

export const Dock = ({children, ...props}: any) =>
  <InnerDock {...props}><div className='block'>{children}</div></InnerDock>
