/** choose a bundle */

import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {deleteBundle, setBundle} from './actions'
import Modal from './components/modal'
import transitDataSource from './transit-data-source'
import authenticatedFetch from './utils/authenticated-fetch'

function mapStateToProps (state) {
  return {
    data: state.scenario.data,
    modifications: state.scenario.modifications
  }
}

function mapDispatchToProps (dispatch) {
  return {
    close: () => dispatch(push('/')),
    deleteBundle: (id) => dispatch(deleteBundle(id)),
    setBundle: (id) => dispatch(setBundle(id))
  }
}

class ChooseBundle extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    setBundle: PropTypes.func.isRequired,
    deleteBundle: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    modifications: PropTypes.object
  }

  deleteBundle (bundleId) {
    // todo window.confirm is bad
    if (window.confirm(`Delete bundle ${this.props.data.bundles.find((b) => b.id === bundleId).name}?`)) {
      authenticatedFetch(`/api/bundle/${bundleId}`, { method: 'delete' })
        .then((res) => {
          this.props.deleteBundle(bundleId)
        })
    }
  }

  setBundle (bundleId) {
    this.props.setBundle(bundleId)
    transitDataSource.getDataForModifications({
      bundleId,
      modifications: this.props.modifications.values()
    })
    this.props.close()
  }

  render () {
    const bundles = this.props.data.bundles
      .filter((b) => b.status === 'DONE')
      .map((b, i) => {
        return (
          <li key={`bundle-${i}`}>
            <a href='#' onClick={(e) => this.props.setBundle(b.id)}>{b.name}</a>&nbsp;<a href='#' onClick={(e) => this.deleteBundle(b.id)}>&times;</a>
          </li>
        )
      })
    return (
      <Modal
        onRequestClose={this.props.close}
        >
        <div>
          <legend>Choose Bundle</legend>
          <ul>{bundles}</ul>
        </div>
      </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseBundle)
