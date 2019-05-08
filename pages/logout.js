import {logout} from 'lib/utils/auth0'

function Logout() {
  logout()
  return null
}

Logout.getInitialProps = async ctx => {
  ctx.reduxStore.setState({})
}

export default Logout
