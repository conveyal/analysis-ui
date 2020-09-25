import {Tooltip} from '@chakra-ui/core'

// Common Tooltip defaults used acrossed the application
export default function Tip({children, label, ...p}) {
  return (
    <Tooltip
      aria-label={`Tooltip: ${label}`}
      hasArrow
      label={label}
      zIndex={1500}
      {...p}
    >
      {children}
    </Tooltip>
  )
}
