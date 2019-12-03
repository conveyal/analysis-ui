import React from 'react'

import message from 'lib/message'

import H5 from '../h5'
import {Checkbox} from '../input'

export default function Variants(props) {
  return (
    <>
      <br />
      <H5>{message('variant.activeIn')}</H5>
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
