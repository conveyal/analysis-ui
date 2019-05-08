import omit from 'lodash/omit'
import React from 'react'

import message from 'lib/message'

import {Button} from '../buttons'

const omitAttributes = m =>
  omit(m, [
    '_id',
    'accessGroup',
    'createdAt',
    'createdBy',
    'nonce',
    'projectId',
    'type',
    'updatedAt',
    'updatedBy'
  ])

export default function JSONEditor(props) {
  const textAreaRef = React.useRef(null)
  const attributes = React.useMemo(
    () => JSON.stringify(omitAttributes(props.modification), null, '\t'),
    [props.modification]
  )
  const save = React.useCallback(() => {
    try {
      const json = JSON.parse(textAreaRef.current.value)
      props.save(json)
    } catch (e) {
      window.alert('Error editing cutom JSON. See console for details.')
      console.error(e)
    }
  }, [props])

  return (
    <>
      <p>{message('modification.customizeDescription')}</p>
      <textarea
        className='form-control monospace'
        defaultValue={attributes}
        key={attributes}
        ref={textAreaRef}
        rows={10}
      />

      <br />

      <Button
        block
        style='success'
        name={message('modification.saveCustomized')}
        onClick={save}
      >
        {message('modification.saveCustomized')}
      </Button>
    </>
  )
}
