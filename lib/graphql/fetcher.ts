export default function fetcher(query) {
  return fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({query})
  })
    .then((res) => res.json())
    .then((json) => json.data)
}
