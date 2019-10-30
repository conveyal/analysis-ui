import Cookie from 'js-cookie'
import nextCookies from 'next-cookies'
import React from 'react'

const key = 'adminTempAccessGroup'

export default function Results(p) {
  const inputRef = React.useRef()
  const [accessGroup, setAccessGroup] = React.useState(p.accessGroup)

  function setGroup() {
    const newGroup = inputRef.current.value
    setAccessGroup(newGroup)
    Cookie.set(key, newGroup)
  }

  return (
    <div className='container'>
      <br />
      <p>
        Current access group is: <strong>{accessGroup}</strong>
      </p>
      <input ref={inputRef} placeholder='Set access group' />
      <button onClick={setGroup}>Set group</button>
    </div>
  )
}

Results.getInitialProps = ctx => {
  const userAccessGroup = ctx.reduxStore.getState().user.accessGroup
  return {accessGroup: nextCookies(ctx)[key] || userAccessGroup}
}
