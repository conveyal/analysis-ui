import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {createVariant, expandVariant, showVariant, updateVariant} from './actions'
import {Button, Group as ButtonGroup} from './components/buttons'
import Icon from './components/icon'
import {Text} from './components/input'
import Title from './components/dock-content-title'
import convertToR5Modification from './export/export'

function mapStateToProps (state) {
  return {
    bundleId: state.scenario.bundleId,
    data: state.scenario.data,
    modifications: state.scenario.modifications,
    name: state.scenario.name,
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
    bundleId: PropTypes.string,
    createVariant: PropTypes.func.isRequired,
    data: PropTypes.object,
    expandVariant: PropTypes.func.isRequired,
    name: PropTypes.string,
    modifications: PropTypes.instanceOf(Map).isRequired,
    showVariant: PropTypes.func.isRequired,
    updateVariant: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired
  }

  exportVariant (variantIndex) {
    const modifications = [...this.props.modifications.values()]
      .filter((mod) => mod.variants[variantIndex])
      .map((mod) => convertToR5Modification(mod))

    const feedChecksums = {}

    for (let fid in this.props.data.feeds) {
      if (!this.props.data.feeds.hasOwnProperty(fid)) continue

      const f = this.props.data.feeds[fid]
      feedChecksums[f.feed_id] = f.checksum
    }

    const scenario = {
      id: 0,
      // project name should probably not be at top level of props, but it is
      description: this.props.name,
      feedChecksums,
      modifications
    }

    // pretty print the json
    const out = JSON.stringify(scenario, null, 2)

    const uri = `data:application/json;base64,${window.btoa(out)}`

    // let filename = `${this.props.projectName.replace(/[^a-zA-Z0-9\._-]/g, '-')}-${this.props.variants[variantIndex].replace(/[^a-zA-Z0-9\._-]/g, '-')}.json`

    const a = document.createElement('a')
    a.setAttribute('href', uri)
    a.setAttribute('target', '_blank')
    // a.setAttribute('download', filename)
    a.click()
  }

  newVariant = () => {
    this.props.createVariant('New variant')
  }

  setVariantName = (index, value) => {
    this.props.updateVariant({ index, value })
  }

  render () {
    const {variants} = this.props
    return (
      <div className='ModificationGroup'>
        <Title>Variants <Button className='pull-right' onClick={this.newVariant} style='success'><Icon type='plus' /> Create</Button></Title>
        <form className='Variants form-inline'>
        {/* using an ordered list as we number the variants rather than spelling out their names in each modification class */}
          {variants.map((v, i) =>
            <div className='Variants-Variant' key={`variant-${i}`}>
              <Text
                label={`${i + 1}. `}
                onChange={(e) => this.setVariantName(i, e.target.value)}
                value={v}
                />
              <ButtonGroup>
                <Button onClick={(e) => this.exportVariant(i)}>Export</Button>
                <Button onClick={(e) => this.expandVariant(i)} title='Expand'>Expand</Button>
                <Button style='info' onClick={(e) => this.showVariant(i)} title='Show on map'><Icon type='eye' /></Button>
              </ButtonGroup>
            </div>)}
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VariantEditor)
