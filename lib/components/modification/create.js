import {faCheck} from '@fortawesome/free-solid-svg-icons'
import toStartCase from 'lodash/startCase'
import React from 'react'

import {MODIFICATION_TYPES} from 'lib/constants'
import message from 'lib/message'

import {Button} from '../buttons'
import Icon from '../icon'
import {Select, Text} from '../input'
import Modal, {ModalBody, ModalTitle} from '../modal'

/**
 * Modal for creating a modification.
 */
export default function CreateModification(p) {
  const [type, setType] = React.useState(MODIFICATION_TYPES[0])
  const [name, setName] = React.useState('')

  return (
    <Modal onRequestClose={p.hide}>
      <ModalTitle>Create new modification</ModalTitle>
      <ModalBody>
        <Select
          label={message('modification.type')}
          onChange={(e) => setType(e.target.value)}
        >
          {MODIFICATION_TYPES.map((type) => (
            <option key={`type-${type}`} value={type}>
              {toStartCase(type)}
            </option>
          ))}
        </Select>
        <Text
          label={message('modification.name')}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          block
          disabled={!name || name.length === 0}
          onClick={() => {
            p.create({name, type}).then(() => p.hide())
          }}
          style='success'
        >
          <Icon icon={faCheck} /> {message('common.create')}
        </Button>
      </ModalBody>
    </Modal>
  )
}
