import {IToast, useToast} from '@chakra-ui/core'
import {useEffect} from 'react'

import LogRocket from 'lib/logrocket'

const isServer = typeof window === 'undefined'
const fn = () => {}
const addListener = isServer ? fn : window.addEventListener
const removeListener = isServer ? fn : window.removeEventListener

const toastSettings: IToast = {
  duration: null,
  isClosable: true,
  position: 'top',
  status: 'error'
}

export default function useErrorHandlingToast() {
  const toast = useToast()
  // Handle error events
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      LogRocket.captureException(e.error)
      toast({
        ...toastSettings,
        title: 'Application Error',
        description: e.message
      })
    }

    const onUnhandledRejection = async (pre: PromiseRejectionEvent) => {
      const e: unknown = pre.reason
      let title = 'Application Error'
      let description = ''
      if (e instanceof Error) {
        LogRocket.captureException(e)
        description = e.message
        if (e.message === 'Failed to fetch') {
          title = 'Failed to contact server.'
          description =
            'Please make sure you have an active internet connection.'
        }
      }

      if (e instanceof Response) {
        ;(title = 'Error while fetching'), (description = e.statusText)
      }

      toast({
        ...toastSettings,
        title,
        description
      })
    }

    addListener('error', onError)
    addListener('unhandledrejection', onUnhandledRejection)

    return () => {
      removeListener('error', onError)
      removeListener('unhandledrejection', onUnhandledRejection)
    }
  }, [toast])
}
