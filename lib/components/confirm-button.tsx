import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/core'
import {useRef, useState} from 'react'

export default function ConfirmButton({action, description, onConfirm, ...p}) {
  const [isOpen, setIsOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = useRef()

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
        size='lg'
      >
        <AlertDialogOverlay />
        <AlertDialogContent borderRadius='md'>
          <AlertDialogHeader fontSize='xl' fontWeight='bold'>
            Confirm
          </AlertDialogHeader>
          <AlertDialogBody fontSize='lg'>{description}</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              isDisabled={confirming}
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
              Confirm: {action}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
