import React from 'react'

import DeepEqual, {pure} from './deep-equal'

export class Input extends DeepEqual {
  state = {
    value: this.props.value
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({value: nextProps.value})
    }
  }

  _onChange = (e) => {
    const {value} = e.target
    this.setState({value})
    const {onChange} = this.props
    if (onChange) onChange(e)
  }

  render () {
    const {name, label, placeholder, ...props} = this.props
    const {value} = this.state

    return <input
      className='form-control'
      placeholder={placeholder || label || name}
      name={name}
      {...props}
      onChange={this._onChange}
      value={value}
      />
  }
}

export const Group = ({label, children}) => {
  return (
    <div className='form-group'>
      {label && <label>{label}</label>}
      {children}
    </div>
  )
}

export const Checkbox = pure(function Checkbox ({label, ...props}) {
  return (
    <div className='checkbox'>
      <label>
        <input
          type='checkbox'
          {...props}
          /> {label}
      </label>
    </div>
  )
})

export const File = pure(function File (props) {
  return (
    <Group {...props}>
      <Input
        type='file'
        {...props}
        />
    </Group>
  )
})

export const Text = pure(function Text (props) {
  return (
    <Group {...props}>
      <Input
        type='text'
        {...props}
        />
    </Group>
  )
})

export const Number = pure(function Number (props) {
  return (
    <Group {...props}>
      <Input
        type='number'
        {...props}
        />
    </Group>
  )
})

export const Select = pure(function Select ({children, ...props}) {
  return (
    <Group {...props}>
      <select
        className='form-control'
        {...props}
        >
        {children}
      </select>
    </Group>
  )
})

export const SelectMultiple = pure(function SelectMultiple (props) {
  return (
    <Group {...props}>
      <select
        className='form-control'
        multiple
        {...props}
        >
        {props.children}
      </select>
    </Group>
  )
})
