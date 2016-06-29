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
import {Button} from './components/buttons'
import Icon from './components/icon'
import Title from './components/dock-content-title'
import Modification from './modification'
import VariantEditor from './variant-editor'

class Scenario extends Component {
  static propTypes = {
    createVariant: PropTypes.func.isRequired,
    modifications: PropTypes.instanceOf(Map).isRequired,
    updateVariant: PropTypes.func.isRequired,
    bundleId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    deleteModification: PropTypes.func.isRequired,
    setActiveModification: PropTypes.func.isRequired,
    setActiveTrips: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired,
    name: PropTypes.string,
    projectName: PropTypes.string.isRequired,
    data: PropTypes.object,
    mapState: PropTypes.object.isRequired,
    scenarioId: PropTypes.string.isRequired
  }

  createMod (createFn) {
    const mod = setVariantsForNewModification({ modification: createFn(this.props.data), variants: this.props.variants })
    mod.scenario = this.props.scenarioId
    this.props.replaceModification(mod)
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
            setActiveTrips={this.props.setActiveTrips}
            />
        })}
      </div>
    )
  }

  render () {
    const {modifications} = this.props
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
        <VariantEditor />

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

function setVariantsForNewModification ({
  modification,
  variants
}) {
  modification.variants = variants.map((v) => true)
  return modification
}

export default Scenario
