// @flow
import React from 'react'

import ErrorModal from './error-modal'
import InnerDock from './inner-dock'
import LabelLayer from './map/label-layer'
import Map from './map'
import Sidebar from './sidebar'

export const Application = (p: any) =>
  <div>
    <ErrorModal />
    <Sidebar />

    <div className='Fullscreen'>
      <Map>{p.map ? p.map(p) : <LabelLayer />}</Map>
    </div>

    <div className='ApplicationDock'>{p.children}</div>
  </div>

export const Title = (p: any) =>
  <div className='ApplicationDockTitle'>{p.children}</div>

export const Dock = (p: any) =>
  <InnerDock><div className='block'>{p.children}</div></InnerDock>
