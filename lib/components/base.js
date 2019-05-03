import dynamic from 'next/dynamic'
import React from 'react'

import ErrorModal from './error-modal'
import InnerDock from './inner-dock'
import Sidebar from './sidebar'

const LabelLayer = dynamic(() => import('./map/label-layer'), {ssr: false})
const Map = dynamic(() => import('./map'), {ssr: false})

export class Application extends React.Component {
  state = {}

  static getDerivedStateFromError(error) {
    console.error(error)
    return {
      hasError: true,
      error
    }
  }

  render() {
    const p = this.props
    const s = this.state
    if (s.hasError) {
      return (
        <ErrorModal
          error={s.error.name}
          errorMessage={s.error.message}
          stack={s.error.stack}
        />
      )
    }

    return (
      <>
        <ErrorModal />
        <Sidebar />

        <div className='Fullscreen'>
          <Map>{p.map ? p.map(p) : <LabelLayer />}</Map>
        </div>

        <div className='ApplicationDock'>{p.children}</div>
      </>
    )
  }
}

export const Title = (p: any) => (
  <div className='ApplicationDockTitle'>{p.children}</div>
)

export const Dock = ({children, ...props}: any) => (
  <InnerDock {...props}>
    <div className='block'>{children}</div>
  </InnerDock>
)
