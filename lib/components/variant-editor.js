import {
  faEye,
  faLock,
  faPencilAlt,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from '../message'

import Collapsible from './collapsible'
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
    <div className='Variants'>
      <Collapsible title={message('variant.plural')}>
        <p>{message('variant.description')}</p>
        <Group>
          <Button block onClick={create} style='success'>
            <Icon icon={faPlus} fixedWidth />
            {message('variant.createAction')}
          </Button>
        </Group>
        <ol start='0'>
          <div className='Variant' key={message('variant.baseline')}>
            <li>
              <i>{message('variant.baseline')}</i>
              <a
                className='pull-right'
                onClick={() => p.showVariant(-1)}
                tabIndex={0}
                title='Hide all'
              >
                <Icon icon={faEye} fixedWidth />
              </a>
              <a
                className='pull-right'
                title='Baseline (empty scenario) cannot be modified'
              >
                <Icon icon={faLock} fixedWidth />
              </a>
            </li>
          </div>
          {p.variants.map((name, index) => (
            <div className='Variant' key={`variant-${index}`}>
              <li>
                {' '}
                {name}
                <a
                  className='pull-right'
                  onClick={() => p.showVariant(index)}
                  tabIndex={0}
                  title={message('variant.showModifications')}
                >
                  <Icon icon={faEye} fixedWidth />
                </a>
                <a
                  className='pull-right'
                  onClick={() => editVariantName(index)}
                  tabIndex={0}
                  title={message('variant.editName')}
                >
                  <Icon icon={faPencilAlt} fixedWidth />
                </a>
                {index !== 0 && (
                  <a
                    className='pull-right'
                    onClick={() => deleteVariant(index)}
                    tabIndex={0}
                    title={message('variant.delete')}
                  >
                    <Icon icon={faTrash} fixedWidth />
                  </a>
                )}
              </li>
            </div>
          ))}
        </ol>
      </Collapsible>
    </div>
  )
}
