import {authIsRequired, bootstrap as bootstrapAuth0} from './auth0'

export default function bootstrap (store) {
  if (authIsRequired) {
    const loggedIn = bootstrapAuth0(store)
    if (!loggedIn) {
      return
    }
  }
}
