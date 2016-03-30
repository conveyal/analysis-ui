/** display a scenario */

import React, { Component, PropTypes } from 'react'

import { create as createAddTripPattern } from './add-trip-pattern'
import { create as createSetTripPhasing } from './set-phasing'
import { create as createRemoveTrips } from './remove-trips'
import { create as createRemoveStops } from './remove-stops'
import { create as createAdjustSpeed } from './adjust-speed'
import { create as createAdjustDwellTime } from './adjust-dwell-time'
import { create as createConvertToFrequency } from './convert-to-frequency'
import { create as createAddStops } from './add-stops'
import TitleButton from './components/dock-content-title-button'
import Title from './components/dock-content-title'
import Modification from './modification'

class Scenario extends Component {
  static propTypes = {
    modifications: PropTypes.instanceOf(Map).isRequired,
    bundleId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    deleteModification: PropTypes.func.isRequired,
    updateVariants: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired,
    data: PropTypes.object
  };

  setVariantsForNewModification (mod) {
    mod.variants = this.props.variants.map((v) => true)
    return mod
  }

  /** Create and save a new add trip pattern modification */
  newAddTripPatternModification = () => {
    this.props.replaceModification(this.setVariantsForNewModification(createAddTripPattern()))
  }

  /** Create and save a new Set Phasing modification */
  newSetPhasingModification = () => {
    this.props.replaceModification(this.setVariantsForNewModification(createSetTripPhasing()))
  }

  /** create and save a new remove trips modification */
  newRemoveTrips = () => {
    this.props.replaceModification(this.setVariantsForNewModification(createRemoveTrips()))
  }

  /** create and save a new remove stops modification */
  newRemoveStops = () => {
    this.props.replaceModification(this.setVariantsForNewModification(createRemoveStops()))
  }

  /** create and save a new adjust speed modification */
  newAdjustSpeed = () => {
    this.props.replaceModification(this.setVariantsForNewModification(createAdjustSpeed()))
  }

  /** create and save a new adjust dwell time modification */
  newAdjustDwellTime = () => {
    this.props.replaceModification(this.setVariantsForNewModification(createAdjustDwellTime()))
  }

  /** create and save a new convert to frequency modification */
  newConvertToFrequency = () => {
    this.props.replaceModification(this.setVariantsForNewModification(createConvertToFrequency()))
  }

  /** create a new add stops modification */
  newAddStops = () => {
    this.props.replaceModification(this.setVariantsForNewModification(createAddStops()))
  }

  setVariantName = (variantIndex, newName) => {
    let variants = [...this.props.variants]
    variants[variantIndex] = newName
    this.props.updateVariants(variants)
  }

  newVariant = () => {
    let variants = [...this.props.variants]
    variants.push('New variant')
    this.props.updateVariants(variants)
  }

  createModifications (mods) {
    return (
      <ul>
      {mods.map((mod) => {
        return <Modification
          modification={mod}
          key={mod.id}
          replaceModification={this.props.replaceModification}
          deleteModification={this.props.deleteModification}
          variants={this.props.variants}
          setMapState={this.props.setMapState}
          data={this.props.data}
          />
      })}
      </ul>
    )
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
        <Title>Variants <TitleButton onClick={this.newVariant}><i className='fa fa-plus'></i></TitleButton></Title>
        <ol>{/* using an ordered list as we number the variants rather than spelling out their names in each modification class */}
          {variants.map((v, i) => <li key={`variant-${i}`}><input type='text' onChange={(e) => this.setVariantName(i, e.target.value)} value={v} /></li>)}
        </ol>

        <Title>Add trip patterns <TitleButton onClick={this.newAddTripPatternModification}><i className='fa fa-plus'></i></TitleButton></Title>
        {this.createModifications(addTripPatterns)}

        <Title>Remove trips <TitleButton onClick={this.newRemoveTrips}><i className='fa fa-plus'></i></TitleButton></Title>
        {this.createModifications(removeTrips)}

        <Title>Remove stops <TitleButton onClick={this.newRemoveStops}><i className='fa fa-plus'></i></TitleButton></Title>
        {this.createModifications(removeStops)}

        <Title>Adjust speed <TitleButton onClick={this.newAdjustSpeed}><i className='fa fa-plus'></i></TitleButton></Title>
        {this.createModifications(adjustSpeed)}

        <Title>Adjust dwell time <TitleButton onClick={this.newAdjustDwellTime}><i className='fa fa-plus'></i></TitleButton></Title>
        {this.createModifications(adjustDwellTime)}

        <Title>Change frequency <TitleButton onClick={this.newConvertToFrequency}><i className='fa fa-plus'></i></TitleButton></Title>
        {this.createModifications(convertToFrequency)}

        <Title>Add stops <TitleButton onClick={this.newAddStops}><i className='fa fa-plus'></i></TitleButton></Title>
        {this.createModifications(addStops)}

        <Title>Set phasing <TitleButton onClick={this.newSetPhasingModification}><i className='fa fa-plus'></i></TitleButton></Title>
        {this.createModifications(setTripPhasing)}

      </div>
      )
  }
}

export default Scenario
