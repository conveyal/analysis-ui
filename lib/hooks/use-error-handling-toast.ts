import {useToast} from '@chakra-ui/core'
import {useEffect} from 'react'

import LogRocket from 'lib/logrocket'

const isServer = typeof window === 'undefined'
const fn = () => {}
const addListener = isServer ? fn : window.addEventListener
const removeListener = isServer ? fn : window.removeEventListener

export default function useErrorHandlingToast() {
  const toast = useToast()
  // Handle error events
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      console.log('ONERROR', e)
      LogRocket.captureException(e.error)
      toast({
        duration: 0,
        isClosable: true,
        status: 'error',
        title: 'Application Error',
        description: e.message
      })
    }
    const onUnhandledRejection = async (pre: PromiseRejectionEvent) => {
      console.log('UNHANDLEDREJECTION', pre)
      const e = pre.reason
      if (e instanceof Error) {
        LogRocket.captureException(e)
        let title = 'Application Error'
        let description = e.message
        if (e.message === 'Failed to fetch') {
          title = 'Failed to contact server.'
          description =
            'Please make sure you have an active internet connection.'
        }
        console.log('SENDONG TOAST')
        toast({
          duration: 0,
          isClosable: true,
          status: 'error',
          title,
          description
        })
      }
    }

    addListener('error', onError)
    addListener('unhandledrejection', onUnhandledRejection)

    return () => {
      removeListener('error', onError)
      removeListener('unhandledrejection', onUnhandledRejection)
    }
  }, [toast])
}
