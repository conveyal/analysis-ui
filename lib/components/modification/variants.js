import React from 'react'

import message from 'lib/message'

import {Checkbox} from '../input'

export default function Variants(props) {
  return (
    <>
      <br />
      <h5>{message('variant.activeIn')}</h5>
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
