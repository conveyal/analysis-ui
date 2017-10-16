import {connect} from 'react-redux'

import {
  createVariant,
  deleteVariant,
  editVariantName,
  showVariant
} from '../actions/scenario'
import VariantEditor from '../components/variant-editor'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, ownProps) {
  return {
    variants: selectVariants(state, ownProps)
  }
}

export default connect(mapStateToProps, {
  createVariant,
  deleteVariant,
  editVariantName,
  showVariant
})(VariantEditor)
