import {
  faEye,
  faLock,
  faPencilAlt,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {useDispatch} from 'react-redux'

import {
  createVariant,
  deleteVariant,
  editVariantName
} from 'lib/actions/project'
import message from 'lib/message'

import * as Panel from './panel'
import {Button} from './buttons'
import Icon from './icon'

export default function Variants(p) {
  const dispatch = useDispatch()

  function _createVariant() {
    const variantName = window.prompt(
      `${message('variant.enterName')}`,
      `${message('variant.name')} ${p.variants.length + 1}`
    )
    if (variantName) dispatch(createVariant(variantName))
  }

  function _deleteVariant(index) {
    if (window.confirm(message('variant.deleteConfirmation'))) {
      dispatch(deleteVariant(index))
    }
  }

  function _editVariantName(index) {
    const variantName = p.variants[index]
    const newVariantName = window.prompt(
      message('variant.enterName'),
      variantName
    )
    if (newVariantName) {
      dispatch(editVariantName({index, name: newVariantName}))
    }
  }

  return (
    <Panel.Collapsible
      defaultExpanded={false}
      heading={() => message('variant.plural')}
    >
      <Panel.Body>
        <p>{message('variant.description')}</p>
        <Button block onClick={_createVariant} style='success'>
          <Icon icon={faPlus} /> {message('variant.createAction')}
        </Button>
      </Panel.Body>
      <div className='list-group'>
        <div className='list-group-item'>
          <i>{message('variant.baseline')}</i>
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
            <span>
              <a
                onClick={() => p.showVariant(index)}
                tabIndex={0}
                title={message('variant.showModifications')}
              >
                <Icon icon={faEye} />
              </a>
              <a
                onClick={() => _editVariantName(index)}
                tabIndex={0}
                title={message('variant.editName')}
              >
                <Icon icon={faPencilAlt} />
              </a>
              {index !== 0 && (
                <a
                  onClick={() => _deleteVariant(index)}
                  tabIndex={0}
                  title={message('variant.delete')}
                >
                  <Icon icon={faTrash} />
                </a>
              )}
            </span>
          </div>
        ))}
      </div>
    </Panel.Collapsible>
  )
}
