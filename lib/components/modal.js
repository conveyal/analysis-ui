import React from 'react'
import Modal from 'react-modal'

const CommonModal = ({children, onRequestClose}) => {
  return <Modal
    isOpen
    onRequestClose={onRequestClose}
    shouldCloseOnOverlayClick
    style={{ overlay: { zIndex: 2500 } }}
    >{children}</Modal>
}

export default CommonModal
