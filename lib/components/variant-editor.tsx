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
import {useDispatch} from 'react-redux'

import {
  createVariant,
  deleteVariant,
  editVariantName
} from 'lib/actions/project'
import message from 'lib/message'

export default function Variants(p) {
  const dispatch = useDispatch()

  function _createVariant() {
    const variantName = window.prompt(
      `${message('variant.enterName')}`,
      `${message('variant.name')} ${p.variants.length + 1}`
    )
    if (variantName) dispatch(createVariant(variantName))
  }

  function _deleteVariant(index) {
    if (window.confirm(message('variant.deleteConfirmation'))) {
      dispatch(deleteVariant(index))
    }
  }

  function _editVariantName(index) {
    const variantName = p.variants[index]
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
        <Text p={4}>{message('variant.description')}</Text>

        <Divider />

        <Flex py={2} px={4}>
          <Text flex='1'>{message('variant.baseline')}</Text>
          <Tooltip
            aria-label='Baseline (empty scenario) cannot be modified'
            label='Baseline (empty scenario) cannot be modified'
          >
            <Icon name='lock' />
          </Tooltip>
        </Flex>
        {p.variants.map((name, index) => (
          <div className='list-group-item' key={`variant-${index + 1}`}>
            {`${index + 1}. `}
            {name}
            <span>
              <a
                onClick={() => p.showVariant(index)}
                tabIndex={0}
                title={message('variant.showModifications')}
              >
                <Icon name='view' />
              </a>
              <a
                onClick={() => _editVariantName(index)}
                tabIndex={0}
                title={message('variant.editName')}
              >
                <Icon name='edit' />
              </a>
              {index !== 0 && (
                <a
                  onClick={() => _deleteVariant(index)}
                  tabIndex={0}
                  title={message('variant.delete')}
                >
                  <Icon name='delete' />
                </a>
              )}
            </span>
          </div>
        ))}
      </Stack>
    </>
  )
}
