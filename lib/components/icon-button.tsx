import {Box, BoxProps, Tooltip, IconButton} from '@chakra-ui/core'
import {PopperProps} from '@chakra-ui/core/dist/Popper'
import {Icons} from '@chakra-ui/core/dist/theme/icons'

type SimpleIconButtonProps = {
  icon: Icons
  label: string
  onClick: (any) => void
  placement?: PopperProps['placement']
  variantColor?: string
} & BoxProps

export default function SimpleIconButton({
  icon,
  label,
  onClick,
  placement,
  variantColor = 'blue',
  ...p
}: SimpleIconButtonProps) {
  return (
    <Box {...p}>
      <Tooltip
        aria-label={label}
        hasArrow
        label={label}
        placement={placement || 'auto'}
        zIndex={1000}
      >
        <IconButton
          aria-label={label}
          icon={icon}
          onClick={onClick}
          size='sm'
          variant='ghost'
          variantColor={variantColor}
        />
      </Tooltip>
    </Box>
  )
}
