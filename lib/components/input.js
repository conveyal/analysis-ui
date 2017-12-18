// @flow
import {format as d3Format} from 'd3-format'
import toKebabCase from 'lodash/kebabCase'
import React, {PureComponent} from 'react'

/**
 * Store the input value in the state. Locally controlled component.
 */
class StateToValue extends PureComponent {
  state = {
    value: this.props.value === null ? undefined : this.props.value
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({value: nextProps.value})
    }
  }

  _onChange = e => {
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
          {units &&
            <span className='InputUnits'>
              {units}
            </span>}
        </div>
      )
    } else {
      return (
        <input
          className='form-control'
          placeholder={placeholder || label || name}
          id={propsToId(this.props)}
          name={name}
          {...props}
          onChange={this._onChange}
          value={value}
        />
      )
    }
  }
}

export class Group extends PureComponent {
  render () {
    const {className, label, children} = this.props
    return (
      <div className={['form-group', className].filter(c => !!c).join(' ')}>
        {label &&
          <label htmlFor={propsToId(this.props)}>
            {label}
          </label>}
        {children}
      </div>
    )
  }
}

export class Checkbox extends PureComponent {
  render () {
    const {label, ...restProps} = this.props
    const id = propsToId(this.props)
    return (
      <div className='checkbox'>
        <label htmlFor={id}>
          <input type='checkbox' {...restProps} id={id} /> {label}
        </label>
      </div>
    )
  }
}

export class File extends PureComponent {
  render () {
    const id = propsToId(this.props)
    return (
      <Group {...this.props} id={id}>
        <Input type='file' {...this.props} id={id} />
      </Group>
    )
  }
}

export class Text extends PureComponent {
  render () {
    const id = propsToId(this.props)
    return (
      <Group {...this.props} id={id}>
        <Input type='text' {...this.props} id={id} />
      </Group>
    )
  }
}

/** A textarea, NB it uses the value attribute, rather than chidren, to set the contents */
export class TextArea extends StateToValue {
  render () {
    const id = propsToId(this.props)
    const {value, ...rest} = this.props
    return (
      <Group {...rest} id={id}>
        <textarea className='form-control' {...rest} id={id}>
          {value}
        </textarea>
      </Group>
    )
  }
}

const preventDefaultIfFocused = e => {
  // http://stackoverflow.com/questions/17614844
  if (e.target === document.activeElement) e.preventDefault()
}

export class Number extends PureComponent {
  render () {
    const id = propsToId(this.props)
    return (
      <Group {...this.props} id={id}>
        <Input
          type='number'
          min={0}
          // http://stackoverflow.com/questions/9712295
          onWheel={preventDefaultIfFocused}
          {...this.props}
          id={id}
        />
      </Group>
    )
  }
}

export class Slider extends StateToValue {
  render () {
    const {format, output, ...props} = this.props
    const outputFormat = d3Format(format || ',r')
    const id = propsToId(props)
    return (
      <Group {...props} id={id}>
        {output &&
          <output className='pull-right' htmlFor={id}>
            {outputFormat(this.state.value)}
          </output>}
        <input
          className='form-control'
          type='range'
          {...props}
          id={id}
          onChange={this._onChange}
          value={this.state.value}
        />
      </Group>
    )
  }
}

export class Select extends StateToValue {
  render () {
    const {children, ...props} = this.props
    const id = propsToId(this.props)
    return (
      <Group {...props} id={id}>
        <select
          className='form-control'
          {...props}
          id={id}
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
    const id = propsToId(this.props)
    return (
      <Group {...props} id={id}>
        <select
          className='form-control'
          multiple
          {...props}
          id={id}
          onBlur={this._onChange}
        >
          {children}
        </select>
      </Group>
    )
  }
}

let counter = 0
function propsToId ({id, label, name}) {
  return id || toKebabCase(`${name || label}-input-${counter++}`)
}
