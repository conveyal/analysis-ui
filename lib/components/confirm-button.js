import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/core'
import React from 'react'

export default function ConfirmButton({action, description, onConfirm, ...p}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [confirming, setConfirming] = React.useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = React.useRef()

  async function doAction() {
    setConfirming(true)
    await onConfirm()
    onClose()
  }

  return (
    <>
      <Button {...p} onClick={() => setIsOpen(true)}>
        {action}
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize='xl' fontWeight='bold'>
            Confirm
          </AlertDialogHeader>
          <AlertDialogBody fontSize='lg'>{description}</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              disabled={confirming}
              onClick={onClose}
              ref={cancelRef}
              size='lg'
            >
              Cancel
            </Button>
            <Button
              isLoading={confirming}
              ml={3}
              onClick={doAction}
              size='lg'
              variantColor='red'
            >
              {action}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
