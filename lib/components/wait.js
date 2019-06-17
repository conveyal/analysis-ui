import usePromise from 'lib/hooks/use-promise'

export default function Wait(p) {
  const result = usePromise(p.promise)
  return p.children(result)
}

export function WaitAll(p) {
  const result = usePromise(Promise.all(p.promises))
  return p.children(result)
}
