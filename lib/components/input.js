import React from 'react'
import {pure} from 'recompose'

const fn = () => {}

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

export const Input = pure(({name, label, placeholder, onChange, ...props}) => {
  return <input
    className='form-control'
    placeholder={placeholder || label || name}
    name={name}
    onChange={onChange || fn}
    {...props}
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
