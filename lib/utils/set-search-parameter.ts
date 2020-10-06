export default function setSearchParameter(parameters: Record<string, string>) {
  if (typeof window === 'undefined') return

  const search = new URLSearchParams(window.location.search)

  // Handle an object of values
  Object.keys(parameters).forEach((key) => {
    const v = parameters[key]
    if (v != null) search.set(key, v)
    else search.delete(key)
  })

  const newUrl = window.location.pathname + '?' + search.toString()
  window.history.replaceState(null, document.title, newUrl)
}
