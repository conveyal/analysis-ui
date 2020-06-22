import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
  Tooltip
} from '@chakra-ui/core'
import {memo} from 'react'
import {useDispatch} from 'react-redux'

import {
  createVariant,
  deleteVariant,
  editVariantName
} from 'lib/actions/project'
import message from 'lib/message'

import IconButton from './icon-button'

type VariantProps = {
  showVariant: (index: number) => void
  variants: string[]
}

export default memo<VariantProps>(function Variants({showVariant, variants}) {
  const dispatch = useDispatch()

  function _createVariant() {
    const variantName = window.prompt(
      `${message('variant.enterName')}`,
      `${message('variant.name')} ${variants.length + 1}`
    )
    if (variantName) dispatch(createVariant(variantName))
  }

  function _deleteVariant(index) {
    if (window.confirm(message('variant.deleteConfirmation'))) {
      dispatch(deleteVariant(index))
    }
  }

  function _editVariantName(index) {
    const variantName = variants[index]
    const newVariantName = window.prompt(
      message('variant.enterName'),
      variantName
    )
    if (newVariantName) {
      dispatch(editVariantName({index, name: newVariantName}))
    }
  }

  return (
    <>
      <Button
        borderRadius={0}
        isFullWidth
        leftIcon='small-add'
        onClick={_createVariant}
        variantColor='green'
      >
        {message('variant.createAction')}
      </Button>
      <Stack>
        <Text px={4} pt={4}>
          {message('variant.description')}
        </Text>

        <Divider />

        <Flex py={2} px={4}>
          <Text flex='1' fontWeight='bold'>
            {message('variant.baseline')}
          </Text>
          <Tooltip
            aria-label='Baseline (empty scenario) cannot be modified'
            label='Baseline (empty scenario) cannot be modified'
          >
            <Box>
              <Icon name='lock' />
            </Box>
          </Tooltip>
        </Flex>
        {variants.map((name, index) => (
          <Flex key={index} pl={4} pr={2}>
            <Text flex='1' fontWeight='bold'>
              {index + 1}. {name}
            </Text>
            <Stack isInline spacing={1}>
              <IconButton
                icon='view'
                label={message('variant.showModifications')}
                onClick={() => showVariant(index)}
              />
              <IconButton
                icon='edit'
                label={message('variant.editName')}
                onClick={() => _editVariantName(index)}
              />
              {index !== 0 && (
                <IconButton
                  icon='delete'
                  label={message('variant.delete')}
                  onClick={() => _deleteVariant(index)}
                  variantColor='red'
                />
              )}
            </Stack>
          </Flex>
        ))}
      </Stack>
    </>
  )
})
