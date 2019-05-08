import message from 'lib/message'
import React from 'react'

import {Checkbox} from '../input'

export default function Variants(props) {
  return (
    <>
      <legend>{message('variant.activeIn')}</legend>
      <div className='form-inline'>
        {props.allVariants.map((v, i) => (
          <Checkbox
            checked={props.activeVariants[i]}
            label={i + 1}
            key={`variant-${i}-modification-${props.modificationId}`}
            onChange={e => props.setVariant(i, e.target.checked)}
            title={v}
          />
        ))}
      </div>
      <br />
    </>
  )
}
