import {format as d3Format} from 'd3-format'
import toKebabCase from 'lodash/kebabCase'
import omit from 'lodash/omit'
import React from 'react'

export function Input(p) {
  if (p.units) {
    return (
      <div className='InputWithUnits'>
        <input
          className='form-control'
          placeholder={p.placeholder || p.label}
          id={propsToId(p)}
          {...p}
          onChange={p.onChange}
          value={p.value}
        />
        {p.units && <span className='InputUnits'>{p.units}</span>}
      </div>
    )
  } else {
    return (
      <input
        className='form-control'
        placeholder={p.placeholder || p.label}
        id={propsToId(p)}
        {...p}
        onChange={p.onChange}
        value={p.value}
      />
    )
  }
}

export function Group(p) {
  return (
    <div className={['form-group', p.className].filter(c => !!c).join(' ')}>
      {p.label && (
        <label className='control-label' htmlFor={propsToId(p)}>
          {p.label}
        </label>
      )}
      {p.children}
      {p.help && <span className='help-block'>{p.help}</span>}
    </div>
  )
}

export function Checkbox(p) {
  const id = propsToId(p)
  return (
    <div className='checkbox'>
      <label htmlFor={id}>
        <input type='checkbox' {...p} id={id} /> {p.label}
      </label>
    </div>
  )
}

export function File(p) {
  const id = propsToId(p)
  return (
    <Group {...p} id={id}>
      <Input type='file' {...p} id={id} />
    </Group>
  )
}

export function Text(p) {
  const id = propsToId(p)
  return (
    <Group {...p} id={id}>
      <Input type='text' {...p} id={id} />
    </Group>
  )
}

/**
 * NB it uses the value attribute, rather than chidren, to set the contents
 */
export function TextArea(p) {
  const id = propsToId(p)
  return (
    <Group label={p.label} id={id}>
      <textarea
        className='form-control'
        defaultValue={p.value}
        onChange={p.onChange}
        id={id}
      />
    </Group>
  )
}

const preventDefaultIfFocused = e => {
  // http://stackoverflow.com/questions/17614844
  if (e.target === document.activeElement) e.preventDefault()
}

/**
 * TODO: Move group out of this component and into individual uses of it.
 */
export function NumberInput(p) {
  const [value, setValue] = React.useState(p.value)
  const [localValue, setLocalValue] = React.useState(p.value)
  const [hasError, setError] = React.useState(false)

  const max = parseFloat(p.max)
  const min = parseFloat(p.min || 0) // can assume this will always be a number

  // If the prop value has changed, update locally
  if (p.value !== value) {
    setValue(p.value)
    setLocalValue(p.value)
  }

  function onChangeCatchErrors(e) {
    const value = parseFloat(e.target.value)
    // Set local value to be exact
    setLocalValue(e.target.value)

    if (isNaN(value) || value < min || (!isNaN(max) && value > max)) {
      return setError(true)
    }

    setError(false)
    setValue(value)
    p.onChange(e)
  }

  const id = propsToId(p)
  const propsLessOnChange = omit(p, [
    'className',
    'children',
    'onChange',
    'value'
  ])
  const groupProps = {...p}
  if (hasError) {
    groupProps.className = p.className
      ? `${p.className} has-error`
      : 'has-error'
  }
  return (
    <Group {...groupProps} id={id}>
      <Input
        type='text'
        min={min}
        // http://stackoverflow.com/questions/9712295
        onChange={onChangeCatchErrors}
        onWheel={preventDefaultIfFocused}
        value={localValue}
        {...propsLessOnChange}
        id={id}
      />
      {hasError && (
        <span className='help-block'>
          {isNaN(parseFloat(max))
            ? `Enter a number ≥ ${min}`
            : `Enter a number between ${min}-${max}`}
        </span>
      )}
      {p.children}
    </Group>
  )
}

export function Slider(p) {
  const {format, output, ...props} = p
  const outputFormat = d3Format(format || ',r')
  const id = propsToId(props)
  return (
    <Group {...props} id={id}>
      {output && (
        <output className='pull-right' htmlFor={id}>
          {outputFormat(p.value)}
        </output>
      )}
      <input
        className='form-control'
        type='range'
        {...props}
        id={id}
        onChange={p.onChange}
        value={p.value}
      />
    </Group>
  )
}

export function Select(p) {
  const {children, ...props} = p
  const id = propsToId(p)
  return (
    <Group {...props} id={id}>
      <select
        className='form-control'
        {...props}
        id={id}
        onBlur={props.onBlur || p.onChange}
        value={p.value}
      >
        {children}
      </select>
    </Group>
  )
}

let counter = 0
function propsToId({id, label, name, placeholder}) {
  return id || toKebabCase(`${name || label || placeholder}-input-${counter++}`)
}
