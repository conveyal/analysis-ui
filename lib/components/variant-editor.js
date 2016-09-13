import debounce from 'debounce'
import React, {Component, PropTypes} from 'react'

import {Button, Group as ButtonGroup} from './buttons'
import Icon from './icon'
import {Text} from './input'
import convertToR5Modification from '../export/export'

export default class VariantEditor extends Component {
  static propTypes = {
    createVariant: PropTypes.func.isRequired,
    currentScenario: PropTypes.object.isRequired,
    modifications: PropTypes.array.isRequired,
    saveScenario: PropTypes.func.isRequired,
    scenarioName: PropTypes.string,
    showVariant: PropTypes.func.isRequired,
    updateVariant: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired,
    scenarioId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired
  }

  _export = (variantIndex) => {
    const {feeds, modifications, scenarioName, variants} = this.props

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

    const filename = `${scenarioName}_${variants[variantIndex]}.json`
      .replace(/[^a-zA-Z0-9]/, '_')

    // pretty print the json
    const out = JSON.stringify(scenario, null, 2)
    const uri = `data:application/json;base64,${window.btoa(out)}`
    const a = document.createElement('a')
    a.setAttribute('href', uri)
    a.setAttribute('target', '_blank')
    a.setAttribute('download', filename)
    a.click()
  }

  _create = () => {
    const {currentScenario, saveScenario} = this.props
    // once upon a time a bug could cause variants to be null. allow recovering from this scenario.
    const variants = currentScenario.variants ? [...currentScenario.variants] : []
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
    const {showVariant, variants, projectId, scenarioId} = this.props
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
              exportVariant={this._export}
              projectId={projectId}
              scenarioId={scenarioId}
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
    const {index, name, projectId, scenarioId} = this.props
    return (
      <div className='Variants-Variant'>
        <Text
          label={`${index + 1}. `}
          onChange={this._update}
          value={name}
          />
        <ButtonGroup>
          <Button onClick={this._export} title='Export'><Icon type='download' /></Button>
          <Button href={`/reports/${projectId}/scenarios/${scenarioId}/variants/${index}`} target='_blank' title='Print'><Icon type='print' /></Button>
          <Button onClick={this._show} style='info' title='Show on map'><Icon type='eye' /></Button>
        </ButtonGroup>
      </div>
    )
  }
}
