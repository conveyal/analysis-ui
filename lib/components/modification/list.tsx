import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  PseudoBox,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels
} from '@chakra-ui/core'
import get from 'lodash/get'
import toStartCase from 'lodash/startCase'
import dynamic from 'next/dynamic'
import {memo, useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import getFeedsRoutesAndStops from 'lib/actions/get-feeds-routes-and-stops'
import {getForProject as loadModifications} from 'lib/actions/modifications'
import {LS_MOM} from 'lib/constants'
import message from 'lib/message'
import * as localStorage from 'lib/utils/local-storage'

import IconButton from '../icon-button'
import InnerDock from '../inner-dock'
import Link from '../link'
import VariantEditor from '../variant-editor'

import CreateModification from './create'

const ModificationsMap = dynamic(
  () => import('lib/components/modifications-map/display-all'),
  {
    loading: () => null,
    ssr: false
  }
)

type Modification = {
  _id: string
  projectId: string
  name: string
}

function filterModifications(filter, modifications, projectId) {
  const filterLcase = filter != null ? filter.toLowerCase() : ''
  const filteredModificationsByType = {}

  modifications
    .filter((m) => m.projectId === projectId)
    .filter(
      (m) => filter === null || m.name.toLowerCase().indexOf(filterLcase) > -1
    )
    .forEach((m) => {
      filteredModificationsByType[m.type] = [
        ...(filteredModificationsByType[m.type] || []),
        m
      ]
    })

  return filteredModificationsByType
}

export default function ModificationsList(p) {
  const dispatch = useDispatch()
  const {_id: projectId, bundleId, regionId} = p.project
  // Retrieve the modifications from the store. Filter out modifications that might be from another project
  const modifications = useSelector((s) => get(s, 'project.modifications'))

  // Load modifications
  useEffect(() => {
    dispatch(loadModifications(projectId))
  }, [dispatch, projectId])

  // Array of ids for currently displayed modifications
  const [modificationsOnMap, setModificationsOnMap] = useState(() => {
    return new Set(get(localStorage.getParsedItem(LS_MOM), projectId, []))
  })

  // Load the GTFS information for the modifications
  useEffect(() => {
    const visibleModifications = modifications.filter((m) =>
      modificationsOnMap.has(m._id)
    )
    if (visibleModifications.length > 0) {
      dispatch(
        getFeedsRoutesAndStops({
          bundleId,
          forceCompleteUpdate: true,
          modifications: visibleModifications
        })
      )
    }
  }, [bundleId, dispatch, modifications, modificationsOnMap])

  // Set and store modifications on map
  const setAndStoreMoM = useCallback(
    (newMoM) => {
      setModificationsOnMap(newMoM)
      const mom = localStorage.getParsedItem(LS_MOM) || {}
      mom[projectId] = Array.from(newMoM)
      localStorage.stringifyAndSet(LS_MOM, mom)
    },
    [setModificationsOnMap]
  )

  const [filter, setFilter] = useState('')
  const [filteredModificationsByType, setFiltered] = useState({})

  // Update filtered modifications when the filter changes
  useEffect(() => {
    setFiltered(filterModifications(filter, modifications, projectId))
  }, [filter, modifications, projectId])

  // Show a variant's modifications on the map
  const showVariant = useCallback(
    (index) => {
      setAndStoreMoM(
        new Set(
          modifications
            .filter((m) => m.variants[index] === true)
            .map((m) => m._id)
        )
      )
    },
    [modifications, setAndStoreMoM]
  )

  // Toggle map appearance
  const toggleMapDisplay = useCallback(
    (_id) => {
      if (modificationsOnMap.has(_id)) {
        modificationsOnMap.delete(_id)
      } else {
        modificationsOnMap.add(_id)
      }
      setAndStoreMoM(new Set(modificationsOnMap))
    },
    [modificationsOnMap, setAndStoreMoM]
  )

  return (
    <>
      <ModificationsMap />

      <Tabs isFitted>
        <TabList>
          <Tab _focus={{outline: 'none'}}>
            {message('modification.plural')}{' '}
            <Badge ml={2}>{modifications.length}</Badge>
          </Tab>
          <Tab _focus={{outline: 'none'}}>{message('variant.plural')}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <CreateModification
              projectId={projectId}
              regionId={regionId}
              variants={p.project.variants}
            />

            <InputGroup>
              <InputLeftElement pl={4} pr={2}>
                <Icon name='search' />
              </InputLeftElement>
              <Input
                borderLeft='none'
                borderRadius={0}
                borderRight='none'
                placeholder={message('modification.filter')}
                onChange={(e) => setFilter(e.target.value)}
                size='lg'
                type='text'
                value={filter}
                _focus={{
                  outline: 'none'
                }}
              />
            </InputGroup>

            <InnerDock>
              {modifications.length > 0 ? (
                <Accordion allowMultiple>
                  {Object.keys(filteredModificationsByType).map((type) => {
                    const ms = filteredModificationsByType[type]
                    return (
                      <AccordionItem
                        border='none'
                        isOpen={ms.length < 10}
                        isDisabled={ms.length === 0}
                        key={type}
                      >
                        <AccordionHeader _focus={{outline: 'none'}} py={2}>
                          <Box flex='1' fontWeight='bold' textAlign='left'>
                            {toStartCase(type)} <Badge>{ms.length}</Badge>
                          </Box>
                          <AccordionIcon />
                        </AccordionHeader>
                        <AccordionPanel py={0} px={1}>
                          <Flex direction='column'>
                            {ms.map((m) => (
                              <ModificationItem
                                isDisplayed={modificationsOnMap.has(m._id)}
                                modification={m}
                                regionId={regionId}
                                toggleMapDisplay={toggleMapDisplay}
                              />
                            ))}
                          </Flex>
                        </AccordionPanel>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              ) : (
                <Box p={4} textAlign='center'>
                  No modifications have been added to this project yet.
                </Box>
              )}
            </InnerDock>
          </TabPanel>

          <TabPanel>
            <VariantEditor
              showVariant={showVariant}
              variants={p.project.variants}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

type ModificationItemProps = {
  isDisplayed: boolean
  modification: Modification
  regionId: string
  toggleMapDisplay: (_id: string) => void
}

const ModificationItem = memo<ModificationItemProps>(
  ({isDisplayed, modification, regionId, toggleMapDisplay}) => (
    <PseudoBox
      borderRadius='4px'
      color='blue.500'
      _hover={{
        backgroundColor: 'rgba(0,0,0,0.04)',
        color: 'blue.700'
      }}
      key={modification._id}
    >
      <Link
        to='modificationEdit'
        modificationId={modification._id}
        projectId={modification.projectId}
        regionId={regionId}
      >
        <Flex align='center' py={1} pl={4} pr={2} cursor='pointer'>
          <Box
            flex='1'
            overflow='hidden'
            pr={4}
            whiteSpace='nowrap'
            style={{textOverflow: 'ellipsis'}}
          >
            {modification.name}
          </Box>
          <IconButton
            icon={isDisplayed ? 'view' : 'view-off'}
            label='Toggle map display'
            onClick={(e) => {
              e.preventDefault()
              toggleMapDisplay(modification._id)
            }}
          />
        </Flex>
      </Link>
    </PseudoBox>
  )
)
