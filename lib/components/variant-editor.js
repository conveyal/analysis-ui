// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'

import Collapsible from './collapsible'

type Props = {
  createVariant: (name: string) => void,
  deleteVariant: (index: number) => void,
  editVariantName: ({index: number, name: string}) => void,
  showVariant: number => void,
  variants: string[]
}

export default class Variants extends Component<void, Props, void> {
  _create = () => {
    const {createVariant, variants} = this.props
    const variantName = window.prompt(
      `${message('variant.enterName')}`,
      `${message('variant.name')} ${variants.length + 1}`
    )
    if (variantName) createVariant(variantName)
  }

  _deleteVariant = memoize((index: number) => () => {
    const {deleteVariant} = this.props
    if (
      window.confirm(message('variant.deleteConfirmation'))
    ) {
      deleteVariant(index)
    }
  })

  _editVariantName = memoize((index: number) => () => {
    const {editVariantName, variants} = this.props
    const variantName = variants[index]
    const newVariantName = window.prompt(message('variant.enterName'),
      variantName
    )
    if (newVariantName) editVariantName({index, name: newVariantName})
  })

  _showVariant = memoize((index: number) => () => {
    this.props.showVariant(index)
  })

  render () {
    const {variants} = this.props
    return (
      <div className='Variants'>
        <Collapsible title={message('variant.plural')}>
            <ol start="0">
              <div className='Variant' key={message('variant.baseline')}>
                <li>
                  <i>{message('variant.baseline')}</i>
                  <a
                    className='pull-right'
                    onClick={this._showVariant(0)} // TODO hide all variants
                    tabIndex={0}
                    title='Hide all'
                  >
                    <Icon type='eye' />
                  </a>
                  <a
                    className='pull-right'
                    title='Baseline (empty scenario) cannot be modified'
                  >
                  <Icon type='lock'/>
                  </a>
                </li>
              </div>
              {variants.map((name, index) => (
                <div className='Variant' key={`variant-${index}`}>
                  <li> {name}
                    <a
                      className='pull-right'
                      onClick={this._showVariant(index)}
                      tabIndex={0}
                      title={message('variant.showModifications')}
                    >
                      <Icon type='eye' />
                    </a>
                    <a
                      className='pull-right'
                      onClick={this._editVariantName(index)}
                      tabIndex={0}
                      title={message('variant.editName')}
                    >
                      <Icon type='pencil' />
                    </a>
                    {index !== 0 &&
                      <a
                        className='pull-right'
                        onClick={this._deleteVariant(index)}
                        tabIndex={0}
                        title={message('variant.delete')}
                      >
                        <Icon type='trash' />
                      </a>}
                  </li>
                </div>
              ))}
              <div className='Variant'>
                <li>
                  <a onClick={this._create}>
                    <i>{message('variant.createAction')}</i>
                  </a>
                </li>
              </div>
            </ol>
        </Collapsible>
      </div>
    )
  }
}
