import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {setActive, setAndRetrieveData} from './actions/modifications'
import {Button} from './components/buttons'
import DeepEqual from './components/deep-equal'
import Icon from './components/icon'
import Panel, {Heading as PanelHeading} from './components/panel'

function mapStateToProps ({
  project,
  scenario
}, {
  modification
}) {
  return {
    bundleId: scenario.currentScenario.bundleId,
    expanded: !!(scenario.activeModification && scenario.activeModification.id === modification.id),
    modification,
    name: modification.name,
    showOnMap: modification.showOnMap
  }
}

function mapDispatchToProps (dispatch, {
  modification
}) {
  return {
    replace: (opts) => dispatch(setAndRetrieveData(opts)),
    setActive: () => dispatch(setActive(modification))
  }
}

class Modification extends DeepEqual {
  static propTypes = {
    bundleId: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    modification: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    replace: PropTypes.func.isRequired,
    setActive: PropTypes.func.isRequired,
    showOnMap: PropTypes.bool.isRequired
  }

  replaceModification = (modification) => {
    const {bundleId, replace} = this.props
    replace({bundleId, modification})
  }

  toggleActive = (e) => {
    e.preventDefault()
    const {setActive, modification} = this.props
    setActive(modification)
  }

  toggleMapDisplay = (e) => {
    e.stopPropagation()
    const {modification, showOnMap} = this.props
    this.replaceModification({
      ...modification,
      showOnMap: !showOnMap
    })
  }

  render () {
    const {expanded, name, showOnMap, setActive} = this.props
    return (
      <Panel onFocus={setActive}>
        <Heading
          expanded={expanded}
          name={name}
          showOnMap={showOnMap}
          toggleActive={this.toggleActive}
          toggleMapDisplay={this.toggleMapDisplay}
          />
      </Panel>
    )
  }
}

function Heading ({
  expanded,
  name,
  showOnMap,
  toggleActive,
  toggleMapDisplay
}) {
  const iconName = expanded ? 'chevron-down' : 'chevron-up'
  const showingOnMap = showOnMap ? 'info' : 'default'
  const showIcon = showOnMap ? 'eye' : 'eye-slash'
  return (
    <PanelHeading onClick={toggleActive}>
      <Icon type={iconName} />
      <strong> {name}</strong>
      <Button
        className='pull-right'
        onClick={toggleMapDisplay}
        size='sm'
        style={showingOnMap}
        title='Toggle map display'
        ><Icon type={showIcon} />
      </Button>
    </PanelHeading>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Modification)
