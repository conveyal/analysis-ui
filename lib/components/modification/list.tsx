import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  PseudoBox,
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels
} from '@chakra-ui/core'
import get from 'lodash/get'
import toStartCase from 'lodash/startCase'
import dynamic from 'next/dynamic'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import getFeedsRoutesAndStops from 'lib/actions/get-feeds-routes-and-stops'
import {getForProject as loadModifications} from 'lib/actions/modifications'
import {CB_HEX, CB_DARK, LS_MOM, MODIFICATION_TYPES} from 'lib/constants'
import message from 'lib/message'
import * as localStorage from 'lib/utils/local-storage'

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
  React.useEffect(() => {
    dispatch(loadModifications(projectId))
  }, [dispatch, projectId])

  // Array of ids for currently displayed modifications
  const [modificationsOnMap, setModificationsOnMap] = React.useState(() =>
    get(localStorage.getParsedItem(LS_MOM), projectId, [])
  )

  // Load the GTFS information for the modifications
  React.useEffect(() => {
    const visibleModifications = modifications.filter((m) =>
      modificationsOnMap.includes(m._id)
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
  function setAndStoreMoM(newMoM) {
    setModificationsOnMap(newMoM)
    const mom = localStorage.getParsedItem(LS_MOM) || {}
    mom[projectId] = newMoM
    localStorage.stringifyAndSet(LS_MOM, mom)
  }

  const [filter, setFilter] = React.useState('')
  const [filteredModificationsByType, setFiltered] = React.useState({})

  // Update filtered modifications when the filter changes
  React.useEffect(() => {
    setFiltered(filterModifications(filter, modifications, projectId))
  }, [filter, modifications, projectId])

  // Show a variant's modifications on the map
  function showVariant(index) {
    setAndStoreMoM(
      modifications.filter((m) => m.variants[index] === true).map((m) => m._id)
    )
  }

  return (
    <>
      <ModificationsMap />

      <Tabs isFitted width='275px'>
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
              <Accordion allowMultiple>
                {Object.keys(filteredModificationsByType).map((type, index) => {
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
                            <PseudoBox
                              borderRadius='4px'
                              color='blue.500'
                              _hover={{
                                backgroundColor: 'rgba(0,0,0,0.04)',
                                color: 'blue.700'
                              }}
                              key={m._id}
                            >
                              <Link
                                to='modificationEdit'
                                modificationId={m._id}
                                projectId={projectId}
                                regionId={regionId}
                              >
                                <Flex
                                  align='center'
                                  py={2}
                                  px={4}
                                  cursor='pointer'
                                >
                                  <Box
                                    flex='1'
                                    overflow='hidden'
                                    pr={4}
                                    whiteSpace='nowrap'
                                    style={{textOverflow: 'ellipsis'}}
                                  >
                                    {m.name}
                                  </Box>
                                  <Icon
                                    name={
                                      modificationsOnMap.find(
                                        (id) => id === m._id
                                      )
                                        ? 'view'
                                        : 'view-off'
                                    }
                                    onClick=''
                                  />
                                </Flex>
                              </Link>
                            </PseudoBox>
                          ))}
                        </Flex>
                      </AccordionPanel>
                    </AccordionItem>
                  )
                })}
              </Accordion>
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

/*
function VP () {
  return (
    <Stack fontSize='14px' isInline>
      <Box>
        <Tip
          className='ShowOnMap fa-btn'
          tip='Hide all modifications from map display'
        >
          <a onClick={() => setAndStoreMoM([])}>
            <Icon icon={faEyeSlash} />
          </a>
        </Tip>
      </Box>
      <Box>
        <Tip tip={message('project.importModifications')}>
          
        </Tip>
      </Box>
    </Stack>
  )
} */
