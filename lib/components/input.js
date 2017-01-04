import React from 'react'

import DeepEqual, {pure} from './deep-equal'

/**
 * Store the input value in the state. Locally controlled component.
 */

class StateToValue extends DeepEqual {
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
}

export class Input extends StateToValue {
  render () {
    const {name, label, placeholder, units, ...props} = this.props
    const {value} = this.state

    if (units) {
      return (
        <div className='InputWithUnits'>
          <input
            className='form-control'
            placeholder={placeholder || units || label || name}
            name={name}
            {...props}
            onChange={this._onChange}
            value={value}
            />
          {units && <span className='InputUnits'>{units}</span>}
        </div>
      )
    } else {
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

export class Text extends DeepEqual {
  render () {
    return (
      <Group {...this.props}>
        <Input
          type='text'
          {...this.props}
          />
      </Group>
    )
  }
}

export const Number = pure(function Number (props) {
  return (
    <Group {...props}>
      <Input
        type='number'
        min={0}
        {...props}
        />
    </Group>
  )
})

export class Select extends StateToValue {
  render () {
    const {children, ...props} = this.props
    return (
      <Group {...props}>
        <select
          className='form-control'
          {...props}
          onChange={this._onChange}
          >
          {children}
        </select>
      </Group>
    )
  }
}

export class SelectMultiple extends StateToValue {
  render () {
    const {children, ...props} = this.props
    return (
      <Group {...props}>
        <select
          className='form-control'
          multiple
          {...props}
          onChange={this._onChange}
          >
          {children}
        </select>
      </Group>
    )
  }
}
