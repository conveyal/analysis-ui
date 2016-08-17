import debounce from 'debounce'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {createVariant, expandVariant, saveToServer, showVariant, updateVariant} from './actions/scenario'
import {Button, Group as ButtonGroup} from './components/buttons'
import Icon from './components/icon'
import {Text} from './components/input'
import convertToR5Modification from './export/export'

function mapStateToProps (state) {
  return {
    currentScenario: state.scenario.currentScenario,
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
    saveScenario: (scenario) => dispatch(saveToServer(scenario)),
    showVariant: (index) => dispatch(showVariant(index)),
    updateVariant: (opts) => dispatch(updateVariant(opts))
  }
}

class VariantEditor extends Component {
  static propTypes = {
    createVariant: PropTypes.func.isRequired,
    currentScenario: PropTypes.object.isRequired,
    expandVariant: PropTypes.func.isRequired,
    modifications: PropTypes.array.isRequired,
    saveScenario: PropTypes.func.isRequired,
    scenarioName: PropTypes.string,
    showVariant: PropTypes.func.isRequired,
    updateVariant: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired
  }

  _export = (variantIndex) => {
    const {feeds, modifications, scenarioName} = this.props

    let r5modifications
    try {
      r5modifications = modifications
        .filter((mod) => mod.variants[variantIndex])
        .map((mod) => convertToR5Modification(mod))
    } catch (e) {
      window.alert(`Can not export variant:\n${e.message}`)
      return
    }

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

  _create = () => {
    const {currentScenario, saveScenario} = this.props
    const variants = [...currentScenario.variants]
    variants.push('New variant')
    saveScenario({
      ...currentScenario,
      variants
    })
  }

  _debouncedSaveScenario = debounce(this.props.saveScenario, 500)
  _update = ({index, name}) => {
    const {currentScenario, updateVariant} = this.props
    const variants = [...currentScenario.variants]
    variants[index] = name
    updateVariant({index, value: name})
    this._debouncedSaveScenario({
      ...currentScenario,
      variants
    })
  }

  render () {
    const {expandVariant, showVariant, variants} = this.props
    return (
      <div className='ModificationGroup'>
        <div className='ModificationGroupTitle'>
          Variants
          <a
            className='pull-right'
            onClick={this._create}
            >
            <Icon type='plus' /> Create
          </a>
        </div>
        <form className='Variants form-inline'>
        {/* using an ordered list as we number the variants rather than spelling out their names in each modification class */}
          {variants.map((v, index) =>
            <Variant
              expand={expandVariant}
              exportVariant={this._export}
              index={index}
              key={`variant-${index}`}
              name={v}
              show={showVariant}
              update={this._update}
              />
            )}
        </form>
      </div>
    )
  }
}

class Variant extends Component {
  _expand = () => {
    const {expand, index} = this.props
    expand(index)
  }

  _export = () => {
    const {exportVariant, index} = this.props
    exportVariant(index)
  }

  _update = (e) => {
    const {index, update} = this.props
    update({
      index,
      name: e.target.value
    })
  }

  _show = () => {
    const {index, show} = this.props
    show(index)
  }

  render () {
    const {index, name} = this.props
    return (
      <div className='Variants-Variant'>
        <Text
          label={`${index + 1}. `}
          onChange={this._update}
          value={name}
          />
        <ButtonGroup>
          <Button onClick={this._export} title='Export'>Export</Button>
          <Button onClick={this._expand} title='Expand'>Expand</Button>
          <Button onClick={this._show} style='info' title='Show on map'><Icon type='eye' /></Button>
        </ButtonGroup>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VariantEditor)
