// @flow
import {shallow} from 'enzyme'
import toJson from 'enzyme-to-json'
import React from 'react'

import {LOADING_GRID} from '../../../constants/analysis-status'
import Title from '../title'

const createProps = () => ({
  abortFetchTravelTimeSurface: jest.fn(),
  createRegionalAnalysis: jest.fn(),
  disableCreateRegionalAnalysis: false,
  disableFetchTravelTimeSurface: false,
  fetchTravelTimeSurface: jest.fn(),
  isochroneFetchStatus: false
})

const snapshot = w => expect(toJson(w)).toMatchSnapshot()

describe('Components > Analysis > Title', () => {
  it('should render properly given different states', () => {
    const props = createProps()
    const wrapper = shallow(<Title {...props} />)
    // default
    snapshot(wrapper)
    wrapper.setProps({...props, disableCreateRegionalAnalysis: true})
    snapshot(wrapper)
    wrapper.setProps({...props, disableFetchTravelTimeSurface: true})
    snapshot(wrapper)
    wrapper.setProps({...props, isochroneFetchStatus: LOADING_GRID})
    snapshot(wrapper)
  })

  it('should disable and enable buttons according to state', () => {
    const props = createProps()
    const wrapper = shallow(<Title {...props} />)
    expect(wrapper.find('Button')).toHaveLength(2)
    expect(wrapper.find('Button').at(0).props().disabled).toEqual(false)
    expect(wrapper.find('Button').at(1).props().disabled).toEqual(false)

    wrapper.setProps({
      ...props,
      disableCreateRegionalAnalysis: true,
      disableFetchTravelTimeSurface: true
    })
    expect(wrapper.find('Button').at(0).props().disabled).toEqual(true)
    expect(wrapper.find('Button').at(1).props().disabled).toEqual(true)

    wrapper.setProps({...props, isochroneFetchStatus: LOADING_GRID})
    expect(wrapper.find('Button').props().style).toEqual('danger')
  })
})
