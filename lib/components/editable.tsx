import {Box, Flex, Input, PseudoBox, useDisclosure} from '@chakra-ui/core'
import {faCheck, faPencilAlt} from '@fortawesome/free-solid-svg-icons'
import {useEffect, useState} from 'react'

import useInput from 'lib/hooks/use-controlled-input'

import IconButton from './icon-button'

const defaultEditLabel = 'Click to edit'

const alwaysValid = (s) => true

export default function Editable({
  isValid = alwaysValid,
  onChange,
  placeholder = 'Add a value',
  value
}) {
  const {isOpen, onClose, onOpen} = useDisclosure()

  if (isOpen) {
    return (
      <HiddenInput
        isValid={isValid}
        onChange={onChange}
        onClose={onClose}
        value={value}
      />
    )
  } else {
    return (
      <PseudoBox
        alignItems='center'
        cursor='pointer'
        display='flex'
        role='group'
        onClick={onOpen}
      >
        {value ? (
          <Box flex='1'>{value}</Box>
        ) : (
          <Box flex='1' color='gray.500'>
            {placeholder}
          </Box>
        )}
        <PseudoBox visibility='hidden' _groupHover={{visibility: 'unset'}}>
          <IconButton
            icon={faPencilAlt}
            label={defaultEditLabel}
            onClick={onOpen}
          />
        </PseudoBox>
      </PseudoBox>
    )
  }
}

function HiddenInput({isValid, onChange, onClose, value}) {
  // Save the original value
  const [originalValue] = useState(value)

  const input = useInput({
    onChange,
    test: isValid,
    value
  })

  // Handle ESC / Enter
  useEffect(() => {
    const listener = ({key}) => {
      if (key === 'Escape') {
        onChange(originalValue)
        onClose()
      } else if (key === 'Enter') {
        onClose()
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, []) // Run once on mount / unmount

  // Select all the text by default
  const inputRef = input.ref
  useEffect(() => {
    const inputElement = inputRef.current
    if (inputElement) {
      inputElement.select()
    }
  }, [inputRef])

  return (
    <Flex align='center'>
      <Input
        {...input}
        height='unset'
        onBlur={onClose}
        outline='none'
        p={0}
        variant='flushed'
      />
      {input.isValid && (
        <IconButton icon={faCheck} label='Save' onClick={onClose} />
      )}
    </Flex>
  )
}
