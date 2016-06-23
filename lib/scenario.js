/** display a scenario */

import React, { Component, PropTypes } from 'react'

import { create as createAddTripPattern } from './add-trip-pattern'
// import { create as createSetTripPhasing } from './set-phasing'
import { create as createRemoveTrips } from './remove-trips'
import { create as createRemoveStops } from './remove-stops'
import { create as createAdjustSpeed } from './adjust-speed'
import { create as createAdjustDwellTime } from './adjust-dwell-time'
import { create as createConvertToFrequency } from './convert-to-frequency'
import { create as createAddStops } from './add-stops'
import {Button, Group as ButtonGroup} from './components/buttons'
import Icon from './components/icon'
import {Text} from './components/input'
import Title from './components/dock-content-title'
import Modification from './modification'
import convertToR5Modification from './export/export'

class Scenario extends Component {
  static propTypes = {
    createVariant: PropTypes.func.isRequired,
    modifications: PropTypes.instanceOf(Map).isRequired,
    updateVariant: PropTypes.func.isRequired,
    bundleId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    deleteModification: PropTypes.func.isRequired,
    setActiveModification: PropTypes.func.isRequired,
    setActivePatterns: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired,
    name: PropTypes.string,
    projectName: PropTypes.string.isRequired,
    data: PropTypes.object,
    mapState: PropTypes.object.isRequired,
    scenarioId: PropTypes.string.isRequired
  };

  setVariantsForNewModification (mod) {
    mod.variants = this.props.variants.map((v) => true)
    return mod
  }

  createMod (createFn) {
    let mod = this.setVariantsForNewModification(createFn(this.props.data))
    mod.scenario = this.props.scenarioId
    this.props.replaceModification(mod)
  }

  setVariantName = (index, value) => {
    this.props.updateVariant({ index, value })
  }

  newVariant = () => {
    this.props.createVariant('New variant')
  }

  createModifications (mods) {
    return (
      <div>
        {mods.map((mod) => {
          return <Modification
            modification={mod}
            key={mod.id}
            replaceModification={this.props.replaceModification}
            deleteModification={this.props.deleteModification}
            variants={this.props.variants}
            setMapState={this.props.setMapState}
            data={this.props.data}
            mapState={this.props.mapState}
            setActiveModification={this.props.setActiveModification}
            setActivePatterns={this.props.setActivePatterns}
            />
        })}
      </div>
    )
  }

  /** export the scenario */
  exportVariant (variantIndex) {
    let modifications = [...this.props.modifications.values()]
      .filter((mod) => mod.variants[variantIndex])
      .map((mod) => convertToR5Modification(mod))

    let feedChecksums = {}

    for (let fid in this.props.data.feeds) {
      if (!this.props.data.feeds.hasOwnProperty(fid)) continue

      let f = this.props.data.feeds[fid]
      feedChecksums[f.feed_id] = f.checksum
    }

    let scenario = {
      id: 0,
      // project name should probably not be at top level of props, but it is
      description: this.props.name,
      feedChecksums,
      modifications
    }

    // pretty print the json
    let out = JSON.stringify(scenario, null, 2)

    let uri = `data:application/json;base64,${window.btoa(out)}`

    // let filename = `${this.props.projectName.replace(/[^a-zA-Z0-9\._-]/g, '-')}-${this.props.variants[variantIndex].replace(/[^a-zA-Z0-9\._-]/g, '-')}.json`

    let a = document.createElement('a')
    a.setAttribute('href', uri)
    a.setAttribute('target', '_blank')
    // a.setAttribute('download', filename)
    a.click()
  }

  /** show a variant on the map */
  showVariant = (variantIndex) => {
    [...this.props.modifications.values()].forEach((mod) => this.props.replaceModification(Object.assign({}, mod, { showOnMap: mod.variants[variantIndex] })))
  }

  /** expand a variant */
  expandVariant = (variantIndex) => {
    [...this.props.modifications.values()].forEach((mod) => this.props.replaceModification(Object.assign({}, mod, { expanded: mod.variants[variantIndex] })))
  }

  render () {
    const {modifications, variants} = this.props
    // sort out the various modification types
    const addTripPatterns = []
    const setTripPhasing = []
    const removeTrips = []
    const removeStops = []
    const adjustSpeed = []
    const adjustDwellTime = []
    const convertToFrequency = []
    const addStops = []

    for (let [, m] of modifications) {
      if (m.type === 'add-trip-pattern') addTripPatterns.push(m)
      else if (m.type === 'set-trip-phasing') setTripPhasing.push(m)
      else if (m.type === 'remove-trips') removeTrips.push(m)
      else if (m.type === 'remove-stops') removeStops.push(m)
      else if (m.type === 'adjust-speed') adjustSpeed.push(m)
      else if (m.type === 'adjust-dwell-time') adjustDwellTime.push(m)
      else if (m.type === 'convert-to-frequency') convertToFrequency.push(m)
      else if (m.type === 'add-stops') addStops.push(m)
    }

    return (
      <div>
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

        {this.renderModificationGroup('Add trip patterns', createAddTripPattern, addTripPatterns)}
        {this.renderModificationGroup('Remove trips', createRemoveTrips, removeTrips)}
        {this.renderModificationGroup('Remove stops', createRemoveStops, removeStops)}
        {this.renderModificationGroup('Adjust speed', createAdjustSpeed, adjustSpeed)}
        {this.renderModificationGroup('Adjust dwell time', createAdjustDwellTime, adjustDwellTime)}
        {this.renderModificationGroup('Change frequency', createConvertToFrequency, convertToFrequency)}
        {this.renderModificationGroup('Add stops', createAddStops, addStops)}
        {/* Set phasing doesn't work right and needs an overhaul, disable for now */}
        {/* this.renderModificationGroup('Set phasing', createSetTripPhasing, setTripPhasing) */}
      </div>
    )
  }

  renderModificationGroup (title, createFn, modifications) {
    return (
      <div className='ModificationGroup'>
        <Title>{title}
          <Button
            className='pull-right'
            onClick={() => this.createMod(createFn)}
            style='success'
            ><Icon type='plus' /> Create
          </Button>
        </Title>
        {this.createModifications(modifications)}
      </div>
    )
  }
}

export default Scenario
