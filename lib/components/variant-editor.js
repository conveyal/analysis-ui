// @flow
import Icon from '@conveyal/woonerf/components/icon'
import debounce from 'lodash/debounce'
import React, {Component} from 'react'

import {Button, Group as ButtonGroup} from './buttons'
import {Text} from './input'
import download from '../utils/download-variant'

type Props = {
  currentScenario: any,
  feeds: Array<{id: string, checksum: string}>,
  modifications: any[],
  saveScenario: (any) => void,
  scenarioName: string,
  showVariant: (number) => void,
  updateVariant: ({index: number, value: string}) => void,
  analyzeVariant: ({projectId: string, scenarioId: string, index: number}) => void,
  variants: string[],
  scenarioId: string,
  projectId: string
}

export default class VariantEditor extends Component<void, Props, void> {
  _export = (variantIndex: number) => {
    const {feeds, modifications, scenarioName, variants} = this.props
    download({
      description: `${scenarioName}-${variants[variantIndex]}`,
      feeds,
      modifications: modifications.filter((m) => m.variants[variantIndex])
    })
  }

  _create = () => {
    const {currentScenario, saveScenario} = this.props
    // once upon a time a bug could cause variants to be null. allow recovering from this scenario.
    saveScenario({
      ...currentScenario,
      variants: [...(currentScenario.variants || []), 'New variant']
    })
  }

  _debouncedSaveScenario = debounce(this.props.saveScenario, 500)
  _update = ({index, name}: {index: number, name: string}) => {
    const {currentScenario, updateVariant} = this.props
    const variants = [...currentScenario.variants]
    variants[index] = name
    updateVariant({index, value: name})
    this._debouncedSaveScenario({
      ...currentScenario,
      variants
    })
  }

  _analyze = (index: number) => {
    const { projectId, scenarioId, analyzeVariant } = this.props
    analyzeVariant({ projectId, scenarioId, index })
  }

  render () {
    const {showVariant, variants, projectId, scenarioId} = this.props
    return (
      <div>
        <div className='DockTitle'>Variants
          <a
            className='pull-right'
            onClick={this._create}
            tabIndex={0}
            >
            <Icon type='plus' /> Create
          </a>
        </div>
        <form className='Variants form-inline'>
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
              analyze={this._analyze}
              />
            )}
        </form>
      </div>
    )
  }
}

type VariantProps = {
  index: number,
  name: string,
  projectId: string,
  scenarioId: string,

  exportVariant: (number) => void,
  analyze: (number) => void,
  show: (number) => void,
  update: ({index: number, name: string}) => void
}

class Variant extends Component<void, VariantProps, void> {
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

  _analyze = () => {
    const {index, analyze} = this.props
    analyze(index)
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
