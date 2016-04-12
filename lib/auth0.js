import Auth0Lock from 'auth0-lock'

export const isRequired = process.env.AUTH0_CLIENT_ID && process.env.AUTH0_DOMAIN
export const lock = new Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)
