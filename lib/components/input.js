import toKebabCase from 'lodash.kebabcase'
import React from 'react'

import DeepEqual, {pure} from './deep-equal'
import {format as d3Format} from 'd3-format'

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
            id={propsToId(this.props)}
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
        id={propsToId(this.props)}
        name={name}
        {...props}
        onChange={this._onChange}
        value={value}
        />
    }
  }
}

export const Group = (props) => {
  const {label, children} = props
  return (
    <div className='form-group'>
      {label && <label htmlFor={propsToId(props)}>{label}</label>}
      {children}
    </div>
  )
}

export const Checkbox = pure(function Checkbox ({label, ...props}) {
  return (
    <div className='checkbox'>
      <label htmlFor={label}>
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

const preventDefaultIfFocused = (e) => {
  // http://stackoverflow.com/questions/17614844
  if (e.target === document.activeElement) e.preventDefault()
}

export const Number = pure(function Number (props) {
  return (
    <Group {...props}>
      <Input
        type='number'
        min={0}
        // http://stackoverflow.com/questions/9712295
        onWheel={preventDefaultIfFocused}
        {...props}
        />
    </Group>
  )
})

export class Slider extends StateToValue {
  render () {
    const {format, output} = this.props
    const outputFormat = d3Format(format || ',r')

    return (
      <Group {...this.props}>
        <input
          className='form-control'
          type='range'
          id={propsToId(this.props)}
          {...this.props}
          onChange={this._onChange} />
        {output && <output className='pull-right' htmlFor={propsToId(this.props)}>
          {outputFormat(this.state.value)}
        </output> }
      </Group>
    )
  }
}

export class Select extends StateToValue {
  render () {
    const {children, ...props} = this.props
    return (
      <Group {...props}>
        <select
          className='form-control'
          {...props}
          onBlur={this._onChange}
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
          onBlur={this._onChange}
          >
          {children}
        </select>
      </Group>
    )
  }
}

function propsToId ({
  id,
  label,
  name
}) {
  return id || toKebabCase(`${name || label}-input`)
}
