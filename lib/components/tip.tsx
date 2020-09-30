import {Tooltip} from '@chakra-ui/core'

const zIndex = 1500 // Chakra modals are set to 1400

// Common Tooltip defaults used acrossed the application
export default function Tip({children, isDisabled = false, label, ...p}) {
  if (isDisabled) return children

  return (
    <Tooltip
      aria-label={`Tooltip: ${label}`}
      hasArrow
      label={label}
      zIndex={zIndex}
      {...p}
    >
      {children}
    </Tooltip>
  )
}
