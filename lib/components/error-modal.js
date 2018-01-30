// @flow
import message from '@conveyal/woonerf/message'
import get from 'lodash/get'
import React from 'react'
import {connect} from 'react-redux'

import {clearError} from '../actions'
import {Button} from './buttons'
import Modal, {ModalBody, ModalTitle} from './modal'

type Props = {
  error: string,
  errorMessage: string,
  clearError: () => void
}

function mapStateToProps (state, ownProps) {
  return {
    error: get(state, 'network.error.error'),
    errorMessage: get(state, 'network.error.detailMessage')
  }
}

class ErrorModal extends React.PureComponent {
  props: Props

  render () {
    const {clearError, error, errorMessage} = this.props

    return !error ? <span /> : <Modal onRequestClose={clearError}>
      <ModalTitle>{message('errorModal.title')}</ModalTitle>
      <ModalBody>
        <p><strong>{error}</strong></p>
        <p><strong>{errorMessage}</strong></p>
        <br />
      </ModalBody>
      <ModalBody>
        <p><em>
          Email a screenshot of your browser window and a description of what you were doing to
          {' '}
          <a href='mailto:analysis@conveyal.com' title='Conveyal Support'>
            analysis@conveyal.com
          </a> to submit an error report.
        </em></p>
        <ul>
          <li>
            <a href='https://support.apple.com/en-us/HT201361' target='_blank'>
              How to take a screenshot on a Mac
            </a>
          </li>
          <li>
            <a
              href='https://www.howtogeek.com/226280/how-to-take-screenshots-in-windows-10/'
              target='_blank'
            >
              How to take a screenshot on a PC
            </a>
          </li>
        </ul>
        <br />
        <p>
          <Button
            block
            onClick={() => {
              clearError()
              window.history.back()
            }}
            style='danger'
          >
            Close this window
          </Button>
        </p>
      </ModalBody>
    </Modal>
  }
}

export default connect(mapStateToProps, {clearError})(ErrorModal)
