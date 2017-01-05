import React from 'react'
import Modal from 'react-modal'

const CommonModal = ({children, contentLabel = 'Modal', onRequestClose}) => {
  return <Modal
    contentLabel={contentLabel}
    isOpen
    onRequestClose={onRequestClose}
    shouldCloseOnOverlayClick
    style={{ overlay: { zIndex: 2500 } }}
    >{children}</Modal>
}

export default CommonModal
