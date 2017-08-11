// @flow
import lonlat from '@conveyal/lonlat'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {Marker, Popup} from 'react-leaflet'

import messages from '../../../utils/messages'
import {Button} from '../../buttons'
import fontawesomeIcon from '../fontawesome-icon'

type Props = {
  autoCreated: boolean,
  bearing: number,
  isStop: boolean,
  snapped: boolean
}

export default class StopMarker extends PureComponent {
  static propTypes = {
    autoCreated: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    isStop: PropTypes.bool.isRequired,
    onDelete: PropTypes.func,
    onDragend: PropTypes.func.isRequired,
    onToggle: PropTypes.func
  }

  state = {
    icon: getIcon(this.props)
  }

  componentWillReceiveProps (nextProps: Props) {
    if (!isEqual(nextProps, this.props)) {
      this.setState({
        icon: getIcon(nextProps)
      })
    }
  }

  onDelete = () => {
    const {index, onDelete} = this.props
    onDelete(index)
  }

  onDragend = (e: Event) => {
    const {autoCreated, index, onDragend} = this.props
    onDragend(e, {autoCreated, index})
  }

  onToggle = () => {
    this.props.onToggle(this.props.index)
  }

  render () {
    const {autoCreated, isStop, position} = this.props
    const {icon} = this.state

    return (
      <Marker
        position={lonlat(position)}
        draggable // TODO drag autocreated stops to fix them in place
        onDragend={this.onDragend}
        icon={icon}
      >
        {!autoCreated &&
          <StopPopup
            isStop={isStop}
            onDelete={this.onDelete}
            onToggle={this.onToggle}
          />}
      </Marker>
    )
  }
}

function getIcon ({autoCreated, bearing, isStop, snapped}) {
  if (isStop) {
    if (autoCreated) {
      return fontawesomeIcon({icon: 'subway', color: '#888', bearing})
    } else if (snapped) {
      return fontawesomeIcon({icon: 'subway', color: '#48f', bearing})
    } else return fontawesomeIcon({icon: 'subway', color: '#000', bearing})
  } else {
    return fontawesomeIcon({icon: 'circle', color: '#48f', iconSize: 16})
  }
}

function StopPopup ({isStop, onDelete, onToggle}) {
  return (
    <Popup>
      <div>
        <Button style='primary' onClick={onToggle}>
          {isStop
            ? messages.transitEditor.makeControlPoint
            : messages.transitEditor.makeStop}
        </Button>&nbsp;
        <Button style='danger' onClick={onDelete}>
          {messages.transitEditor.deletePoint}
        </Button>
      </div>
    </Popup>
  )
}
