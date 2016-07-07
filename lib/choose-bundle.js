/** choose a bundle */

import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {deleteBundle, setBundle} from './actions'
import getDataForModifications from './actions/get-data-for-modifications'
import Modal from './components/modal'

function mapStateToProps (state) {
  return {
    bundles: state.scenario.bundles,
    modifications: state.scenario.modifications
  }
}

function mapDispatchToProps (dispatch) {
  return {
    close: () => dispatch(push('/')),
    deleteBundle: (id) => dispatch(deleteBundle(id)),
    getDataForModifications: (opts) => dispatch(getDataForModifications(opts)),
    setBundle: (id) => dispatch(setBundle(id))
  }
}

class ChooseBundle extends Component {
  static propTypes = {
    bundles: PropTypes.array.isRequired,
    close: PropTypes.func.isRequired,
    deleteBundle: PropTypes.func.isRequired,
    modifications: PropTypes.array.isRequired,
    setBundle: PropTypes.func.isRequired
  }

  deleteBundle (bundle) {
    // TODO window.confirm is bad...is it?
    if (window.confirm(`Delete bundle ${bundle.name}?`)) {
      this.props.deleteBundle(bundle.id)
    }
  }

  setBundle (id) {
    this.props.setBundle(id)
    this.props.getDataForModifications({
      bundleId: id,
      modifications: this.props.modifications,
      forceCompleteUpdates: true
    })
  }

  render () {
    return (
      <Modal
        onRequestClose={this.props.close}
        >
        <div>
          <legend>Choose Bundle</legend>
          <ul>{this.renderBundles()}</ul>
        </div>
      </Modal>
    )
  }

  renderBundles () {
    return this.props.bundles
      .filter((b) => b.status === 'DONE')
      .map((b, i) => {
        return (
          <li key={`bundle-${i}`}>
            <a
              href='#'
              onClick={(e) => {
                this.setBundle(b.id)
                this.props.close()
              }}
              >{b.name}</a>
            <a
              href='#'
              onClick={(e) => this.deleteBundle(b)}
              style={{
                marginLeft: '5px',
                display: 'inline-block'
              }}
              >&times;</a>
          </li>
        )
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseBundle)
