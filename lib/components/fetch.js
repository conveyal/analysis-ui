import useFetchAction from 'lib/hooks/use-fetch-action'

export default function Fetch(p) {
  const results = useFetchAction(p.fetch)
  return p.children(results)
}
