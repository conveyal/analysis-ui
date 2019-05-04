import {
  faEye,
  faLock,
  faPencilAlt,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from 'lib/message'

import * as Panel from './panel'
import {Button} from './buttons'
import Icon from './icon'
import {Group} from './input'

export default function Variants(p) {
  function create() {
    const variantName = window.prompt(
      `${message('variant.enterName')}`,
      `${message('variant.name')} ${p.variants.length + 1}`
    )
    if (variantName) p.createVariant(variantName)
  }

  function deleteVariant(index) {
    if (window.confirm(message('variant.deleteConfirmation'))) {
      p.deleteVariant(index)
    }
  }

  function editVariantName(index) {
    const variantName = p.variants[index]
    const newVariantName = window.prompt(
      message('variant.enterName'),
      variantName
    )
    if (newVariantName) p.editVariantName({index, name: newVariantName})
  }

  return (
    <Panel.Collapsible
      defaultExpanded={false}
      heading={() => message('variant.plural')}
    >
      <Panel.Body>
        <p>{message('variant.description')}</p>
        <Button block onClick={create} style='success'>
          <Icon icon={faPlus} /> {message('variant.createAction')}
        </Button>
      </Panel.Body>
      <div className='list-group'>
        <div className='list-group-item'>
          <i>{message('variant.baseline')}</i>
          <a
            className='pull-right'
            onClick={() => p.showVariant(-1)}
            tabIndex={0}
            title='Hide all'
          >
            <Icon icon={faEye} />
          </a>
          <a
            className='pull-right'
            title='Baseline (empty scenario) cannot be modified'
          >
            <Icon icon={faLock} />
          </a>
        </div>
        {p.variants.map((name, index) => (
          <div className='list-group-item' key={`variant-${index}`}>
            {`${index}. `}
            {name}
            <a
              className='pull-right'
              onClick={() => p.showVariant(index)}
              tabIndex={0}
              title={message('variant.showModifications')}
            >
              <Icon icon={faEye} />
            </a>
            <a
              className='pull-right'
              onClick={() => editVariantName(index)}
              tabIndex={0}
              title={message('variant.editName')}
            >
              <Icon icon={faPencilAlt} />
            </a>
            {index !== 0 && (
              <a
                className='pull-right'
                onClick={() => deleteVariant(index)}
                tabIndex={0}
                title={message('variant.delete')}
              >
                <Icon icon={faTrash} />
              </a>
            )}
          </div>
        ))}
      </div>
    </Panel.Collapsible>
  )
}
