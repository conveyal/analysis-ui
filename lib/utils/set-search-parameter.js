export default function setSearchParameter(name, value) {
  if (typeof window === 'undefined') return

  const search = new URLSearchParams(window.location.search)

  // Handle an object of values
  if (typeof name === 'object') {
    const parameters = name
    Object.keys(parameters).forEach((key) => {
      const v = parameters[key]
      if (v != null) search.set(key, v)
      else search.delete(key)
    })
  } else {
    if (value != null) search.set(name, value)
    else search.delete(name)
  }

  const newUrl = window.location.pathname + '?' + search.toString()
  window.history.replaceState(null, document.title, newUrl)
}
