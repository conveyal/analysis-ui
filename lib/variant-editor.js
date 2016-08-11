import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {createVariant, expandVariant, showVariant, updateVariant} from './actions'
import {Button, Group as ButtonGroup} from './components/buttons'
import Icon from './components/icon'
import {Text} from './components/input'
import convertToR5Modification from './export/export'

function mapStateToProps (state) {
  return {
    feeds: state.scenario.feeds,
    modifications: state.scenario.modifications,
    scenarioName: state.scenario.name,
    variants: state.scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createVariant: (name) => dispatch(createVariant(name)),
    expandVariant: (index) => dispatch(expandVariant(index)),
    showVariant: (index) => dispatch(showVariant(index)),
    updateVariant: (opts) => dispatch(updateVariant(opts))
  }
}

class VariantEditor extends Component {
  static propTypes = {
    createVariant: PropTypes.func.isRequired,
    expandVariant: PropTypes.func.isRequired,
    modifications: PropTypes.array.isRequired,
    scenarioName: PropTypes.string,
    showVariant: PropTypes.func.isRequired,
    updateVariant: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired
  }

  exportVariant (variantIndex) {
    const {feeds, modifications, scenarioName} = this.props

    const r5modifications = modifications
      .filter((mod) => mod.variants[variantIndex])
      .map((mod) => convertToR5Modification(mod))

    const feedChecksums = {}
    feeds.forEach((f) => {
      feedChecksums[f.id] = f.checksum
    })

    const scenario = {
      id: 0,
      // scenario name should probably not be at top level of props, but it is
      description: scenarioName,
      feedChecksums,
      modifications: r5modifications
    }

    // pretty print the json
    const out = JSON.stringify(scenario, null, 2)
    const uri = `data:application/json;base64,${window.btoa(out)}`
    const a = document.createElement('a')
    a.setAttribute('href', uri)
    a.setAttribute('target', '_blank')
    a.click()
  }

  _createVariant = () => {
    this.props.createVariant('New variant')
  }

  render () {
    const {expandVariant, showVariant, updateVariant, variants} = this.props
    return (
      <div className='ModificationGroup'>
        <div className='ModificationGroupTitle'>
          Variants
          <a
            className='pull-right'
            onClick={this._createVariant}
            >
            <Icon type='plus' /> Create
          </a>
        </div>
        <form className='Variants form-inline'>
        {/* using an ordered list as we number the variants rather than spelling out their names in each modification class */}
          {variants.map((v, index) =>
            <div className='Variants-Variant' key={`variant-${index}`}>
              <Text
                label={`${index + 1}. `}
                onChange={(e) => updateVariant({index, value: e.target.value})}
                value={v}
                />
              <ButtonGroup>
                <Button onClick={(e) => this.exportVariant(index)} title='Export'>Export</Button>
                <Button onClick={(e) => expandVariant(index)} title='Expand'>Expand</Button>
                <Button onClick={(e) => showVariant(index)} style='info' title='Show on map'><Icon type='eye' /></Button>
              </ButtonGroup>
            </div>)}
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VariantEditor)
