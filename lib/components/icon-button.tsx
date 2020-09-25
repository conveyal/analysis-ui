import {Box, BoxProps, Button, ButtonProps} from '@chakra-ui/core'
import {PopperProps} from '@chakra-ui/core/dist/Popper'
import {IconDefinition} from '@fortawesome/free-solid-svg-icons'

import Icon from './icon'
import Tip from './tip'

type IconButtonProps = {
  icon: IconDefinition
  isActive?: boolean
  isDisabled?: boolean
  label: string
  onClick: (e: MouseEvent) => void
  placement?: PopperProps['placement']
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: ButtonProps['variant']
  variantColor?: ButtonProps['variantColor']
} & BoxProps

export default function IconButton({
  icon,
  isActive = false,
  isDisabled = false,
  label,
  onClick,
  placement,
  size = 'sm',
  variant = 'ghost',
  variantColor = 'blue',
  ...p
}: IconButtonProps) {
  return (
    <Box {...p}>
      <Tip label={label} placement={placement || 'auto'}>
        <Button
          aria-label={label}
          isActive={isActive}
          isDisabled={isDisabled}
          onClick={onClick}
          size={size}
          variant={variant}
          variantColor={variantColor}
        >
          <Icon icon={icon} fixedWidth={false} />
        </Button>
      </Tip>
    </Box>
  )
}
