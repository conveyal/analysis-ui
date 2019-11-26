import {createSelector} from 'reselect'

import selectModificationFeed from './modification-feed'

export default createSelector(selectModificationFeed, (feed = {}) => feed.stops)
