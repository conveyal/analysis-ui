import React from 'react'

const fn = () => {}

export const Group = ({label, children}) => {
  return (
    <div className='form-group'>
      {label && <label>{label}</label>}
      {children}
    </div>
  )
}

export const Input = ({name, placeholder, onChange, type, value, ...props}) => {
  return <input
    className='form-control'
    name={name}
    placeholder={placeholder || props.name}
    onChange={onChange || fn}
    type={type}
    value={value}
    {...props}
    />
}

export const Text = (props) => {
  return (
    <Group {...props}>
      <Input
        type='text'
        {...props}
        />
    </Group>
  )
}

export const Number = (props) => {
  return (
    <Group {...props}>
      <Input
        type='number'
        {...props}
        />
    </Group>
  )
}

export const Select = ({children, ...props}) => {
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
}

export const SelectMultiple = (props) => {
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
}
