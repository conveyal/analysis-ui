import {format as d3Format} from 'd3-format'
import toKebabCase from 'lodash/kebabCase'
import omit from 'lodash/omit'
import React from 'react'

function useValue(propValue, propOnChange) {
  const [value, setValue] = React.useState(propValue)

  const onChange = React.useCallback(
    e => {
      setValue(e.currentTarget.value)
      if (propOnChange) propOnChange(e)
    },
    [propOnChange]
  )

  return [value, onChange]
}

export function Input(p) {
  const [value, onChange] = useValue(p.value, p.onChange)

  if (p.units) {
    return (
      <div className='InputWithUnits'>
        <input
          className='form-control'
          placeholder={p.placeholder || p.units || p.label || p.name}
          id={propsToId(p)}
          {...p}
          onChange={onChange}
          value={value}
        />
        {p.units && <span className='InputUnits'>{p.units}</span>}
      </div>
    )
  } else {
    return (
      <input
        className='form-control'
        placeholder={p.placeholder || p.label || p.name}
        id={propsToId(p)}
        {...p}
        onChange={onChange}
        value={value}
      />
    )
  }
}

export function Group(p) {
  return (
    <div className={['form-group', p.className].filter(c => !!c).join(' ')}>
      {p.label && <label htmlFor={propsToId(p)}>{p.label}</label>}
      {p.children}
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
  const [value, onChange] = useValue(p.value, p.onChange)
  const id = propsToId(p)
  return (
    <Group label={p.label} id={id}>
      <textarea
        className='form-control'
        defaultValue={value}
        onChange={onChange}
        id={id}
      />
    </Group>
  )
}

const preventDefaultIfFocused = e => {
  // http://stackoverflow.com/questions/17614844
  if (e.target === document.activeElement) e.preventDefault()
}

export function Number(p) {
  const [hasError, setError] = React.useState(false)

  function onChangeCatchErrors(e) {
    const value = parseFloat(e.target.value)
    const max = parseFloat(p.max)
    const min = parseFloat(p.min || 0) // can assume this will always be a number
    if (isNaN(value) || value < min || (!isNaN(max) && value > max)) {
      return setError(true)
    }
    setError(false)
    p.onChange(e)
  }

  const id = propsToId(p)
  const propsLessOnChange = omit(p, ['className', 'onChange'])
  const {max, min = 0} = p
  const groupProps = {...p}
  if (hasError) {
    groupProps.className = p.className
      ? `${p.className} has-error`
      : 'has-error'
  }
  return (
    <Group {...groupProps} id={id}>
      <Input
        type='number'
        min={min}
        // http://stackoverflow.com/questions/9712295
        onChange={onChangeCatchErrors}
        onWheel={preventDefaultIfFocused}
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
    </Group>
  )
}

export function Slider(p) {
  const [value, onChange] = useValue(p.value, p.onChange)
  const {format, output, ...props} = p
  const outputFormat = d3Format(format || ',r')
  const id = propsToId(props)
  return (
    <Group {...props} id={id}>
      {output && (
        <output className='pull-right' htmlFor={id}>
          {outputFormat(value)}
        </output>
      )}
      <input
        className='form-control'
        type='range'
        {...props}
        id={id}
        onChange={onChange}
        value={value}
      />
    </Group>
  )
}

export function Select(p) {
  const [value, onChange] = useValue(p.value, p.onChange)
  const {children, ...props} = p
  const id = propsToId(p)
  return (
    <Group {...props} id={id}>
      <select
        className='form-control'
        {...props}
        id={id}
        onBlur={props.onBlur || onChange}
        value={value}
      >
        {children}
      </select>
    </Group>
  )
}

let counter = 0
function propsToId({id, label, name}) {
  return id || toKebabCase(`${name || label}-input-${counter++}`)
}
