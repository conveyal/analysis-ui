import React from 'react'
import ReactModal from 'react-modal'

export default function Modal(p) {
  return (
    <ReactModal
      ariaHideApp={false}
      className='CustomModal container'
      contentLabel={p.contentLabel || 'Modal'}
      isOpen
      onRequestClose={p.onRequestClose}
      shouldCloseOnOverlayClick
      style={{overlay: {zIndex: 2500}}}
    >
      {p.children}
    </ReactModal>
  )
}

export const ModalBody = props => (
  <div className='CustomModal-block'>{props.children}</div>
)

export const ModalTitle = props => (
  <div className='CustomModal-title'>{props.children}</div>
)
