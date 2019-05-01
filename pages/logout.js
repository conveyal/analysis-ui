import {logout} from '../lib/utils/auth0'

function Logout(p) {
  logout()
  return null
}

Logout.getInitialProps = async ctx => {
  ctx.reduxStore.setState({})
}

export default Logout
