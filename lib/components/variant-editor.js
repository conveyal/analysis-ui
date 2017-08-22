// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'

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
      'Enter a variant name:',
      `Variant ${variants.length + 1}`
    )
    if (variantName) createVariant(variantName)
  }

  _deleteVariant = memoize((index: number) => () => {
    const {deleteVariant, variants} = this.props
    const name = variants[index]
    if (
      window.confirm(
        `Are you sure you want to delete variant ${name}? This will clear all references to this variant from each modification.`
      )
    ) {
      deleteVariant(index)
    }
  })

  _editVariantName = memoize((index: number) => () => {
    const {editVariantName, variants} = this.props
    const variantName = variants[index]
    const newVariantName = window.prompt(
      'Enter a new variant name:',
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
      <div>
        <div className='DockTitle'>
          <Icon type='clone' /> Variants
          <a className='pull-right' onClick={this._create} tabIndex={0}>
            <Icon type='plus' />
          </a>
        </div>
        <div className='Variants'>
          {variants.map((name, index) =>
            <div className='Variant' key={`variant-${index}`}>
              {name}
              <a
                className='pull-right'
                onClick={this._showVariant(index)}
                tabIndex={0}
                title='Show modifications for this variant on the map'
              >
                <Icon type='eye' />
              </a>
              <a
                className='pull-right'
                onClick={this._editVariantName(index)}
                tabIndex={0}
                title='Edit this variant name'
              >
                <Icon type='pencil' />
              </a>
              {index !== 0 &&
                <a
                  className='pull-right'
                  onClick={this._deleteVariant(index)}
                  tabIndex={0}
                  title='Delete this variant'
                >
                  <Icon type='trash' />
                </a>}
            </div>
          )}
        </div>
      </div>
    )
  }
}
