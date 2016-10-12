import configureStore from 'redux-mock-store'
import promise from 'redux-promise'

const mockStore = configureStore([promise])
export default mockStore
