import {Button, Menu, MenuButton, MenuList, MenuItem} from '@chakra-ui/core'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import snakeCase from 'lodash/snakeCase'
import {useDispatch, useSelector} from 'react-redux'

import {fetchGeoTIFF} from 'lib/actions/analysis'
import selectMaxTripDurationMinutes from 'lib/selectors/max-trip-duration-minutes'
import downloadCSV from 'lib/utils/download-csv'
import downloadGeoTIFF from 'lib/utils/download-geotiff'
import downloadJson from 'lib/utils/download-json'

import Icon from '../icon'

export default function DownloadMenu({
  isDisabled,
  isochrone,
  opportunityDataset,
  percentileCurves,
  projectId,
  projectName,
  requestsSettings,
  variantIndex,
  ...p
}) {
  const dispatch = useDispatch()
  const cutoff = useSelector(selectMaxTripDurationMinutes)

  function downloadIsochrone() {
    downloadJson({
      data: {
        ...isochrone,
        properties: {} // TODO set this in jsolines
      },
      filename:
        snakeCase(`conveyal isochrone ${projectName} at ${cutoff} minutes`) +
        '.json'
    })
  }

  function downloadOpportunitiesCSV() {
    const header =
      Array(120)
        .fill(0)
        .map((_, i) => i + 1)
        .join(',') + '\n'
    const csvContent = percentileCurves.map((row) => row.join(',')).join('\n')
    const name = snakeCase(
      `Conveyal ${projectName} percentile access to ${get(
        opportunityDataset,
        'name'
      )}`
    )
    downloadCSV(header + csvContent, name)
  }

  // TODO don't dispatch an action, just fetch and show the button in a loading state
  function onClickDownloadGeoTIFF() {
    return dispatch(
      fetchGeoTIFF({
        projectId,
        variantIndex,
        ...requestsSettings
      })
    )
      .then((r) => r.arrayBuffer())
      .then((data) => {
        downloadGeoTIFF({
          data,
          filename: snakeCase(`conveyal geotiff ${projectName}`) + '.geotiff'
        })
      })
  }

  return (
    <Menu>
      <MenuButton as={Button} isDisabled={isDisabled} {...p}>
        <Icon icon={faDownload} />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={downloadIsochrone}>Isochrone as GeoJSON</MenuItem>
        <MenuItem onClick={onClickDownloadGeoTIFF}>
          Isochrone as GeoTIFF
        </MenuItem>
        <MenuItem
          isDisabled={!percentileCurves}
          onClick={downloadOpportunitiesCSV}
          title={percentileCurves ? '' : 'Opportunity dataset must be selected'}
        >
          Access to opportunities as CSV
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
