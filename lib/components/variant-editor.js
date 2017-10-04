// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'
import messages from '../utils/messages'

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
      `${messages.scenario.enterName}`,
      `${messages.common.scenario} ${variants.length + 1}`
    )
    if (variantName) createVariant(variantName)
  }

  _deleteVariant = memoize((index: number) => () => {
    const {deleteVariant} = this.props
    if (
      window.confirm(
        `${messages.scenario.deleteConfirmation}`
      )
    ) {
      deleteVariant(index)
    }
  })

  _editVariantName = memoize((index: number) => () => {
    const {editVariantName, variants} = this.props
    const variantName = variants[index]
    const newVariantName = window.prompt(
      `${messages.scenario.enterName}`,
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
          <Icon type='clone' /> {messages.scenario.plural}
          <a
            className='pull-right'
            onClick={this._create}
            tabIndex={0}
            title={messages.scenario.createAction}
          >
            <Icon type='plus' /> Create
          </a>
        </div>
        <div className='Variants'>
          {variants.map((name, index) => (
            <div className='Variant' key={`variant-${index}`}>
              {index + 1}. {name}
              <a
                className='pull-right'
                onClick={this._showVariant(index)}
                tabIndex={0}
                title={messages.scenario.showModifications}
              >
                <Icon type='eye' />
              </a>
              <a
                className='pull-right'
                onClick={this._editVariantName(index)}
                tabIndex={0}
                title={messages.scenario.editName}
              >
                <Icon type='pencil' />
              </a>
              {index !== 0 &&
                <a
                  className='pull-right'
                  onClick={this._deleteVariant(index)}
                  tabIndex={0}
                  title={messages.scenario.delete}
                >
                  <Icon type='trash' />
                </a>}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
