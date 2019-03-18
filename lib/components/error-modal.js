// @flow
import message from '@conveyal/woonerf/message'
import get from 'lodash/get'
import React from 'react'
import {connect} from 'react-redux'

import {clearError} from '../actions'

import {Button} from './buttons'
import Modal, {ModalBody, ModalTitle} from './modal'
import Collapsible from './collapsible'

type Props = {
  clearError: () => void,
  error: string,
  errorMessage: string,
  stack: string,
  url: string
}

const stackStyle = {
  fontFamily: 'monospace',
  whiteSpace: 'pre'
}

function mapState (state, ownProps) {
  const error = get(state, 'network.error')
  return {
    error: ownProps.error || get(error, 'error'),
    errorMessage: ownProps.errorMessage || get(error, 'detailMessage'),
    url: get(error, 'url'),
    stack: ownProps.stack || get(error, 'stack')
  }
}

function mapDispatch (d, ownProps) {
  const clear = () => d(clearError)
  return {
    clearError: ownProps.clear || clear
  }
}

export function ErrorModal (p: Props) {
  const {clearError, error, errorMessage, url, stack} = p
  return !error ? <span /> : <Modal onRequestClose={clearError}>
    <ModalTitle>
      {message('error.title')}
      <Button
        onClick={() => {
          clearError()
        }}
        style='danger'
        className='pull-right'
      >
        {message('error.close')}
      </Button>
    </ModalTitle>
    <ModalBody>
      <p><strong>{error}</strong></p>
      <p>{errorMessage}</p>
      {p.url && <p>{url}</p>}
      {p.stack &&
        <Collapsible
          title={message('error.details')}
        >
          <p style={stackStyle}>{stack}</p>
        </Collapsible>}
      <p>
        {message('error.report') + ' '}
        <a href={'mailto:' + `${message('error.supportEmail')}` +
          '?subject=Conveyal Analysis Error&body=' +
          encodeURIComponent(`${url}`) + ' ' + encodeURIComponent(`${stack}`.substring(0, 350))}>
          {message('error.supportEmail')}.
        </a>
      </p>
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
            window.history.back()
            clearError()
          }}
          style='warning'
        >
          {message('error.back')}
        </Button>
      </p>
    </ModalBody>
  </Modal>
}

export default connect(mapState, mapDispatch)(ErrorModal)
