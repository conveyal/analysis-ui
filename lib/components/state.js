import React from 'react'

export default function State(p) {
  const [state, setState] = React.useState(p.initialState)
  return p.children(state, setState)
}
