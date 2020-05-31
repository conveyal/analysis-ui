import get from 'lodash/get'
import {useCallback, useEffect, useRef, useState} from 'react'

const alwaysValid = (v) => true // eslint-disable-line

// Is this the value itself or an event?
function getRawValueFromInput(input) {
  const isEvent =
    input instanceof Event || get(input, 'nativeEvent') instanceof Event
  if (isEvent) {
    const target = input.target
    if (target.type === 'checkbox') return target.checked
    return target.value
  } else {
    return input
  }
}

export default function useControlledInput(
  propValue,
  propOnChange,
  testValid = alwaysValid
): any {
  const [inputValue, setInputValue] = useState(propValue)
  const ref = useRef()

  // Update the value from the external source on change unless the input is
  // currently the active element.
  useEffect(() => {
    if (ref.current !== document.activeElement) setInputValue(propValue)
  }, [propValue, ref, setInputValue])

  const onChange = useCallback(
    (input) => {
      const rawValue = getRawValueFromInput(input)
      const isValid = testValid(rawValue)
      // Ensure the displayed value syncs fast, even if it's not valid
      setInputValue(rawValue)
      // Don't pass invalid changes through to the onChange function
      if (!isValid) return
      // Allow the sync to occur before propogating the change
      setTimeout(() => propOnChange(rawValue), 0)
    },
    [propOnChange, setInputValue, testValid]
  )

  // Test current value validity
  const isValid = testValid(inputValue)

  // Store the return values
  const [returnValue, setReturnValue] = useState({
    // Name properties for {...spreading} on an input
    onChange,
    isInvalid: !isValid, // Chakra UI uses isInvalid on FormControls
    isValid,
    ref,
    value: inputValue
  })

  // Memoize the object based on it's values for reference checking
  useEffect(() => {
    setReturnValue({
      onChange,
      isInvalid: !isValid,
      isValid,
      ref,
      value: inputValue
    })
  }, [onChange, inputValue, isValid, ref])

  return returnValue
}
