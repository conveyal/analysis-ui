import React from 'react'
import {pure} from 'recompose'

export const Group = ({label, children}) => {
  return (
    <div className='form-group'>
      {label && <label>{label}</label>}
      {children}
    </div>
  )
}

export const Checkbox = pure(({label, ...props}) => {
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

export const Input = pure(({defaultValue, name, label, placeholder, onChange, value, ...props}) => {
  let controlledProps = {}
  if (onChange) {
    controlledProps = {
      defaultValue: defaultValue || value,
      onChange,
      value
    }
  } else {
    controlledProps = {
      value: defaultValue || value
    }
  }
  return <input
    className='form-control'
    placeholder={placeholder || label || name}
    name={name}
    {...props}
    {...controlledProps}
    />
})

export const File = pure((props) => {
  return (
    <Group {...props}>
      <Input
        type='file'
        {...props}
        />
    </Group>
  )
})

export const Text = pure((props) => {
  return (
    <Group {...props}>
      <Input
        type='text'
        {...props}
        />
    </Group>
  )
})

export const Number = pure((props) => {
  return (
    <Group {...props}>
      <Input
        type='number'
        {...props}
        />
    </Group>
  )
})

export const Select = pure(({children, ...props}) => {
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

export const SelectMultiple = pure((props) => {
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
