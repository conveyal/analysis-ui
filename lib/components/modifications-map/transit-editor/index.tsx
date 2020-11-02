import {Button, useDisclosure, useToast} from '@chakra-ui/core'
import lonlat from '@conveyal/lonlat'
import {LatLng, LeafletMouseEvent} from 'leaflet'
import {useCallback, useEffect, useState} from 'react'
import {Marker, Polyline, Popup, useLeaflet} from 'react-leaflet'

import {ADD_TRIP_PATTERN, MINIMUM_SNAP_STOP_ZOOM_LEVEL} from 'lib/constants'
import colors from 'lib/constants/colors'
import {DEFAULT_SEGMENT_SPEED} from 'lib/constants/timetables'
import useOnMount from 'lib/hooks/use-on-mount'
import Leaflet from 'lib/leaflet'
import message from 'lib/message'
import getStopsFromSegments from 'lib/utils/get-stops'
import getNearestStopToPoint from 'lib/utils/get-stop-near-point'
import getLineString from 'lib/utils/get-line-string'
import createLogDomEvent from 'lib/utils/log-dom-event'

import {
  getControlPointIconForZoom,
  getNewStopIconForZoom,
  getSnappedStopIconForZoom
} from '../../map/circle-icons'

// Valid modification types for this component
type Modification = CL.AddTripPattern | CL.Reroute

type ControlPoint = {
  position: LatLng
  index: number
}

type TransitEditorProps = {
  allowExtend: boolean
  allStops: GTFS.Stop[]
  extendFromEnd: boolean
  followRoad: boolean
  modification: Modification
  spacing: number
  updateModification: (update: Partial<Modification>) => void
}

const logDomEvent = createLogDomEvent('transit-editor')

/**
 * Check if the Leaflet point goes over the anti-meridian.
 */
const latlngIsOutOfRange = (ll: L.LatLng) =>
  ll.lng >= 180 || ll.lng <= -180 || (ll.lat >= 90 && ll.lat <= -90)

const outOfRangeMessage = (ll: L.LatLng) =>
  `Selected point ${ll.toString()} is invalid. Coordinates must not go over the anti-meridian.`

// We previously allowed segment speeds to get out of sync with the segments.
// This ensures consistent array lengths.
const extendSegmentSpeedsTo = (ss: number[], newLength: number): number[] => {
  const lastSpeed = ss[ss.length - 1] || DEFAULT_SEGMENT_SPEED
  for (let i = ss.length; i < newLength; i++) {
    ss.push(lastSpeed)
  }
  return ss
}

// Helper function to get the coordinates from a segment depending on type
const coordinatesFromSegment = (
  {geometry}: CL.ModificationSegment,
  end = false
): GeoJSON.Position => {
  if (geometry.type === 'Point') return geometry.coordinates
  if (geometry.type === 'LineString') {
    return end ? geometry.coordinates.slice(-1)[0] : geometry.coordinates[0]
  }
  console.error('Invalid geometry type')
  return []
}

function useZoom() {
  const leaflet = useLeaflet()
  const [zoom, setZoom] = useState(leaflet.map.getZoom())

  useEffect(() => {
    const handleZoomEnd = () => setZoom(leaflet.map.getZoom())
    leaflet.map.on('zoomend', handleZoomEnd)
    return () => {
      leaflet.map.off('zoomend', handleZoomEnd)
    }
  }, [leaflet, setZoom])

  return zoom
}

function useNewStopIcon() {
  const zoom = useZoom()
  const [newStopIcon, setNewStopIcon] = useState(() =>
    getNewStopIconForZoom(zoom)
  )
  useEffect(() => {
    setNewStopIcon(getNewStopIconForZoom(zoom))
  }, [zoom])

  return newStopIcon
}

// Get the modification segments. Always return an array
const getSegments = (m: Modification): CL.ModificationSegment[] => [
  ...(m.segments || [])
]

// Hook for getting the segments
function useSegments(modification: Modification) {
  const [segments, setSegments] = useState<CL.ModificationSegment[]>(
    modification.segments || []
  )
  useEffect(() => {
    setSegments(modification.segments || [])
  }, [modification.segments])
  return segments
}

/**
 * Create/edit a new route
 */
export default function TransitEditor({
  allowExtend,
  allStops,
  extendFromEnd,
  followRoad,
  modification,
  spacing,
  updateModification
}: TransitEditorProps) {
  const leaflet = useLeaflet()
  const segments = useSegments(modification)
  const toast = useToast()
  const zoom = useZoom()

  const latlngIsInvalidCheck = useCallback(
    (latlng: L.LatLng): boolean => {
      if (latlngIsOutOfRange(latlng)) {
        toast({
          description: outOfRangeMessage(latlng),
          position: 'top',
          status: 'error'
        })
        return true
      }
      return false
    },
    [toast]
  )

  // Initial mount only. Fit bounds to route
  useOnMount(() => {
    if (segments.length === 0) return
    // Focus the map on the routes
    const bounds = new Leaflet.LatLngBounds([])
    if (segments.length === 1 && segments[0].geometry.type === 'Point') {
      leaflet.map.flyTo(lonlat.toLeaflet(segments[0].geometry.coordinates))
    } else {
      for (const segment of segments) {
        if (segment.geometry.type === 'LineString') {
          // Should always be true
          for (const coord of segment.geometry.coordinates) {
            bounds.extend(lonlat.toLeaflet(coord))
          }
        }
      }
      leaflet.map.fitBounds(bounds)
    }
  })

  const updateSegments = useCallback(
    (newSegments: CL.ModificationSegment[]) => {
      updateModification({segments: newSegments})
    },
    [updateModification]
  )

  const getStopNearPoint = useCallback(
    (point: L.LatLng) => {
      if (zoom >= MINIMUM_SNAP_STOP_ZOOM_LEVEL) {
        return getNearestStopToPoint(point, allStops, zoom)
      }
    },
    [allStops, zoom]
  )

  const handleMapClick = useCallback(
    async (event: L.LeafletMouseEvent) => {
      logDomEvent('Map.onClick', event)
      const {latlng} = event
      if (latlngIsInvalidCheck(latlng)) return
      if (!allowExtend) {
        // TODO: Show message about `allowExtend`
        return
      }

      // Add a new stop and update the segments
      updateModification(
        await addStop(
          latlng,
          modification,
          extendFromEnd,
          followRoad,
          spacing,
          getStopNearPoint(latlng)
        )
      )
    },
    [
      allowExtend,
      extendFromEnd,
      followRoad,
      getStopNearPoint,
      latlngIsInvalidCheck,
      modification,
      spacing,
      updateModification
    ]
  )

  useEffect(() => {
    leaflet.map.on('click', handleMapClick)
    return () => leaflet.map.off('click', handleMapClick)
  }, [handleMapClick, leaflet])

  const insertStopAtIndex = useCallback(
    async (index: number, latlng: L.LatLng) => {
      if (latlngIsInvalidCheck(latlng)) return
      updateModification(
        await insertStop(
          latlng,
          index,
          modification,
          followRoad,
          getStopNearPoint(latlng)
        )
      )
    },
    [
      followRoad,
      latlngIsInvalidCheck,
      getStopNearPoint,
      modification,
      updateModification
    ]
  )

  const deleteStopOrPoint = useCallback(
    async (index) => {
      const newSegments = await deleteStopOrPointFromSegments(
        modification,
        index,
        followRoad
      )
      updateModification(newSegments)
    },
    [followRoad, modification, updateModification]
  )

  const _onStopDragEnd = useCallback(
    async (stopIndex: number, latlng: L.LatLng) => {
      if (latlngIsInvalidCheck(latlng)) return
      updateSegments(
        await onStopDragEnd(
          latlng,
          stopIndex,
          segments,
          followRoad,
          getStopNearPoint(latlng)
        )
      )
    },
    [
      followRoad,
      getStopNearPoint,
      latlngIsInvalidCheck,
      segments,
      updateSegments
    ]
  )

  const _onControlPointDragEnd = useCallback(
    async (stopIndex: number, latlng: L.LatLng) => {
      if (latlngIsInvalidCheck(latlng)) return

      updateSegments(
        await onControlPointDragEnd(latlng, stopIndex, segments, followRoad)
      )
    },
    [followRoad, latlngIsInvalidCheck, segments, updateSegments]
  )

  return (
    <>
      <Segments clickSegment={insertStopAtIndex} modification={modification} />
      <AutoCreatedStops onDragEnd={insertStopAtIndex} segments={segments} />
      <ControlPoints
        deletePoint={deleteStopOrPoint}
        onDragEnd={_onControlPointDragEnd}
        segments={segments}
        updateSegments={updateSegments}
      />
      <Stops
        deleteStop={deleteStopOrPoint}
        onStopDragEnd={_onStopDragEnd}
        segments={segments}
        updateSegments={updateSegments}
      />
    </>
  )
}

const getLineWeightForZoom = (z) => (z < 11 ? 1 : z - 10)
function useLineWeight() {
  const zoom = useZoom()
  const [lineWeight, setLineWeight] = useState(() => getLineWeightForZoom(zoom))
  useEffect(() => {
    setLineWeight(getLineWeightForZoom(zoom))
  }, [zoom])

  return lineWeight
}

function useSegmentFeatures(modification: Modification): L.LatLng[][] {
  const segments = useSegments(modification)
  const [segmentFeatures, setSegmentFeatures] = useState(() =>
    flattenSegments(segments)
  )
  useEffect(() => {
    setSegmentFeatures(flattenSegments(segments))
  }, [segments, setSegmentFeatures])
  return segmentFeatures
}

function Segments({clickSegment, modification}) {
  const lineWeight = useLineWeight()
  const segmentFeatures = useSegmentFeatures(modification)
  const showStop = useDisclosure()

  return (
    <>
      {segmentFeatures.map((feature, index) => (
        <Polyline
          color={colors.ADDED}
          key={index}
          onClick={(event: L.LeafletMouseEvent) => {
            logDomEvent('Segment.onClick', event)
            Leaflet.DomEvent.stop(event)
            clickSegment(index, event.latlng)
          }}
          onBlur={showStop.onClose}
          onFocus={showStop.onOpen}
          onMouseover={showStop.onOpen}
          onMouseout={showStop.onClose}
          positions={feature}
          weight={lineWeight}
        />
      ))}
      {showStop.isOpen && <NewStopUnderCursor />}
    </>
  )
}

/**
 * Get the current cursor position as a Leaflet.LatLng
 */
function useCursorPosition() {
  const leaflet = useLeaflet()
  const [cursorPosition, setCursorPosition] = useState<LatLng | null>(null)

  useEffect(() => {
    const handleMouseMove = (event: LeafletMouseEvent) =>
      setCursorPosition(event.latlng)
    leaflet.map.on('mousemove', handleMouseMove)
    return () => {
      leaflet.map.off('mousemove', handleMouseMove)
    }
  }, [leaflet, setCursorPosition])

  return cursorPosition
}

/**
 * Show a new stop under the cursor when hovering over a segment.
 */
function NewStopUnderCursor() {
  const cursorPosition = useCursorPosition()
  const newStopIcon = useNewStopIcon()
  return cursorPosition != null ? (
    <Marker position={cursorPosition} icon={newStopIcon} interactive={false} />
  ) : null
}

function useStops(segments: CL.ModificationSegment[]) {
  const [stops, setStops] = useState<CL.StopFromSegment[]>(() =>
    getStopsFromSegments(segments)
  )
  useEffect(() => {
    setStops(getStopsFromSegments(segments))
  }, [segments])

  return stops
}

function AutoCreatedStops({onDragEnd, segments}) {
  const newStopIcon = useNewStopIcon()
  const stops = useStops(segments)

  return (
    <>
      {stops
        .filter((s) => s.autoCreated)
        .map((stop, i) => (
          <Marker
            position={lonlat.toLeaflet(stop)}
            draggable
            icon={newStopIcon}
            key={`auto-created-stop-${i}-${lonlat.toString(stop)}`}
            onClick={(event: L.LeafletMouseEvent) => {
              logDomEvent('AutoCreatedStop.onClick', event)
              Leaflet.DomEvent.stop(event)
              onDragEnd(stop.index, event.latlng)
            }}
            onDragend={(event: L.DragEndEvent) => {
              logDomEvent('AutoCreatedStop.onDragend', event)
              Leaflet.DomEvent.stop(event)
              onDragEnd(stop.index, (event.target as L.Marker).getLatLng())
            }}
            opacity={0.5}
            zIndexOffset={500}
          />
        ))}
    </>
  )
}

function useNewSnappedStopIcon() {
  const zoom = useZoom()
  const [newSnappedStopIcon, setNewSnappedStopIcon] = useState(() =>
    getSnappedStopIconForZoom(zoom)
  )

  useEffect(() => {
    setNewSnappedStopIcon(getSnappedStopIconForZoom(zoom))
  }, [zoom])

  return newSnappedStopIcon
}

function Stops({deleteStop, onStopDragEnd, segments, updateSegments}) {
  const stops = useStops(segments)
  const newSnappedStopIcon = useNewSnappedStopIcon()
  const newStopIcon = useNewStopIcon()

  const toggleStop = useCallback(
    (stopIndex) => {
      if (stopIndex < segments.length) {
        segments[stopIndex] = {
          ...segments[stopIndex],
          stopAtStart: false,
          fromStopId: null
        }
      }

      if (stopIndex > 0) {
        segments[stopIndex - 1] = {
          ...segments[stopIndex - 1],
          stopAtEnd: false,
          toStopId: null
        }
      }
      updateSegments(segments)
    },
    [segments, updateSegments]
  )

  return (
    <>
      {stops
        .filter((s) => !s.autoCreated)
        .map((stop) => (
          <Marker
            position={lonlat.toLeaflet(stop)}
            icon={stop.stopId ? newSnappedStopIcon : newStopIcon}
            draggable
            key={`stop-${stop.index}-${lonlat.toString(stop)}`}
            onDragend={(event: L.DragEndEvent) => {
              logDomEvent('Stop.onDragEnd', event)
              Leaflet.DomEvent.stop(event)
              onStopDragEnd(stop.index, (event.target as L.Marker).getLatLng())
            }}
            zIndexOffset={1000}
          >
            <Popup>
              <div>
                <Button
                  onClick={() => toggleStop(stop.index)}
                  variantColor='teal'
                >
                  {message('transitEditor.makeControlPoint')}
                </Button>
                &nbsp;
                <Button
                  onClick={() => deleteStop(stop.index)}
                  variantColor='red'
                >
                  {message('transitEditor.deletePoint')}
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  )
}

function useControlPoints(segments: CL.ModificationSegment[]) {
  const [controlPoints, setControlPoints] = useState(() =>
    getControlPointsForSegments(segments)
  )
  useEffect(() => {
    setControlPoints(getControlPointsForSegments(segments))
  }, [segments])
  return controlPoints
}

function useControlPointIcon() {
  const zoom = useZoom()
  const [controlPointIcon, setControlPointIcon] = useState(() =>
    getControlPointIconForZoom(zoom)
  )

  useEffect(() => {
    setControlPointIcon(getControlPointIconForZoom(zoom))
  }, [zoom])

  return controlPointIcon
}

function ControlPoints({deletePoint, onDragEnd, segments, updateSegments}) {
  const controlPoints = useControlPoints(segments)
  const controlPointIcon = useControlPointIcon()

  const togglePoint = useCallback(
    (pointIndex: number) => {
      if (pointIndex < segments.length) {
        segments[pointIndex] = {
          ...segments[pointIndex],
          stopAtStart: true
        }
      }

      if (pointIndex > 0) {
        segments[pointIndex - 1] = {
          ...segments[pointIndex - 1],
          stopAtEnd: true
        }
      }

      updateSegments(segments)
    },
    [segments, updateSegments]
  )

  return (
    <>
      {controlPoints.map((p) => (
        <Marker
          position={p.position}
          draggable
          icon={controlPointIcon}
          key={`cp-${p.index}-${p.position.toString()}`}
          onDragend={(event: L.DragEndEvent) => {
            logDomEvent('ControlPoint.onDragend', event)
            Leaflet.DomEvent.stop(event)
            onDragEnd(p.index, (event.target as L.Marker).getLatLng())
          }}
          zIndexOffset={750}
        >
          <Popup>
            <div>
              <Button onClick={() => togglePoint(p.index)} variantColor='blue'>
                {message('transitEditor.makeStop')}
              </Button>
              &nbsp;
              <Button onClick={() => deletePoint(p.index)} variantColor='red'>
                {message('transitEditor.deletePoint')}
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

/**
 * Handle a user clicking on the map
 */
async function addStop(
  latlng: LatLng,
  modification: Modification,
  extendFromEnd: boolean,
  followRoad: boolean,
  spacing: number,
  snapStop: null | GTFS.Stop
): Promise<Partial<Modification>> {
  const segments = getSegments(modification)

  const coordinates: GeoJSON.Position = snapStop
    ? [snapStop.stop_lon, snapStop.stop_lat]
    : [latlng.lng, latlng.lat]
  const stopId: void | string = snapStop?.stop_id

  let newSegments: CL.ModificationSegment[]
  if (segments.length > 0) {
    if (extendFromEnd) {
      // Insert a segment at the end
      const lastSegment = segments[segments.length - 1]
      const from = coordinatesFromSegment(lastSegment, true)
      const geometry = await getLineString(from, coordinates, {
        followRoad
      })

      newSegments = [
        ...segments,
        {
          fromStopId: lastSegment.toStopId,
          geometry,
          spacing,
          stopAtEnd: true,
          stopAtStart: lastSegment.stopAtEnd,
          toStopId: stopId
        }
      ]
    } else {
      const firstSegment = segments[0]
      const to = coordinatesFromSegment(firstSegment)
      const geometry = await getLineString(coordinates, to, {followRoad})

      newSegments = [
        {
          fromStopId: stopId,
          geometry,
          spacing,
          stopAtEnd: firstSegment.stopAtStart,
          stopAtStart: true,
          toStopId: firstSegment.fromStopId
        },
        ...segments
      ]
    }

    // Remove all leftover point features
    newSegments = newSegments.filter((s) => s.geometry.type !== 'Point')
  } else {
    newSegments = [
      {
        fromStopId: stopId,
        geometry: {type: 'Point', coordinates},
        spacing,
        stopAtEnd: true,
        stopAtStart: true,
        toStopId: stopId
      }
    ]
  }

  // Update the segment speeds
  const updateSegmentSpeeds = (ss: CL.SegmentSpeeds) => {
    if (!extendFromEnd) {
      ss.unshift(ss[0] || DEFAULT_SEGMENT_SPEED)
    }

    return extendSegmentSpeedsTo(ss, newSegments.length)
  }

  if (modification.type === ADD_TRIP_PATTERN) {
    return {
      segments: newSegments,
      timetables: modification.timetables.map((tt) => ({
        ...tt,
        segmentSpeeds: updateSegmentSpeeds([...tt.segmentSpeeds])
      }))
    }
  } else {
    // type === REROUTE
    return {
      segments: newSegments,
      segmentSpeeds: updateSegmentSpeeds([...modification.segmentSpeeds])
    }
  }
}

/**
 * When an existing stop is dragged, reflow the segments around it. If an existing stop is close by
 * snap to that stop.
 */
async function onStopDragEnd(
  latlng: LatLng,
  stopIndex: number,
  segments: CL.ModificationSegment[],
  followRoad: boolean,
  snapStop: null | GTFS.Stop
): Promise<CL.ModificationSegment[]> {
  const coordinates = snapStop
    ? [snapStop.stop_lon, snapStop.stop_lat]
    : [latlng.lng, latlng.lat]
  const newStopId = snapStop?.stop_id

  const isEnd = stopIndex === segments.length
  const isStart = stopIndex === 0

  const newSegments = [...segments]
  if (!isStart) {
    const previousSegment = segments[stopIndex - 1]
    const geometry = await getLineString(
      coordinatesFromSegment(previousSegment),
      coordinates,
      {followRoad}
    )
    // Overwrite geometry and preserve other attributes
    newSegments[stopIndex - 1] = {
      ...previousSegment,
      toStopId: newStopId,
      geometry
    }
  }

  if (!isEnd) {
    const nextSegment = segments[stopIndex]
    newSegments[stopIndex] = {
      ...nextSegment,
      fromStopId: newStopId,
      geometry: await getLineString(
        coordinates,
        coordinatesFromSegment(nextSegment, true),
        {followRoad}
      )
    }
  }

  return newSegments
}

/**
 * When a control point is dragged, reflow the segments around it.
 */
async function onControlPointDragEnd(
  latlng: LatLng,
  controlPointIndex: number,
  segments: CL.ModificationSegment[],
  followRoad: boolean
): Promise<CL.ModificationSegment[]> {
  const isEnd = controlPointIndex === segments.length
  const isStart = controlPointIndex === 0
  const coordinates = [latlng.lng, latlng.lat]

  const newSegments = [...segments]
  if (!isStart) {
    const previousSegment = newSegments[controlPointIndex - 1]
    // Overwrite geometry and preserve other attributes
    newSegments[controlPointIndex - 1] = {
      ...previousSegment,
      geometry: await getLineString(
        coordinatesFromSegment(previousSegment),
        coordinates,
        {followRoad}
      )
    }
  }

  if (!isEnd) {
    const nextSegment = newSegments[controlPointIndex]
    // Can be a point if only one stop has been created
    const toCoordinates = coordinatesFromSegment(nextSegment, true)
    newSegments[controlPointIndex] = {
      ...nextSegment,
      geometry: await getLineString(coordinates, toCoordinates, {
        followRoad
      })
    }
  }

  return newSegments
}

/**
 * Delete stop or point and create new segments and segment speeds. Return the new modification
 * values ready to send as an update.
 */
async function deleteStopOrPointFromSegments(
  modification: Modification,
  index: number,
  followRoad: boolean
): Promise<Partial<Modification>> {
  let segments = getSegments(modification)
  const newSegmentsLength = segments.length - 1

  if (index === 0) {
    segments = segments.slice(1)

    // Update segment speeds
    const removeFirstSegmentSpeed = (ss) =>
      extendSegmentSpeedsTo(ss.slice(1), newSegmentsLength)

    if (modification.type === ADD_TRIP_PATTERN) {
      return {
        segments,
        timetables: modification.timetables.map((tt) => ({
          ...tt,
          segmentSpeeds: removeFirstSegmentSpeed([...tt.segmentSpeeds])
        }))
      }
    } else {
      // type === REROUTE
      return {
        segments,
        segmentSpeeds: removeFirstSegmentSpeed([...modification.segmentSpeeds])
      }
    }
  } else if (index === segments.length) {
    // nb stop index not hop index
    segments.pop()

    // Update segment speeds
    const removeLastSegmentSpeed = (ss) => {
      if (ss.length === segments.length) {
        return ss.slice(0, -1)
      } else {
        return extendSegmentSpeedsTo(ss, newSegmentsLength)
      }
    }

    if (modification.type === ADD_TRIP_PATTERN) {
      return {
        segments,
        timetables: modification.timetables.map((tt) => ({
          ...tt,
          segmentSpeeds: removeLastSegmentSpeed(tt.segmentSpeeds)
        }))
      }
    } else {
      // type === REROUTE
      return {
        segments,
        segmentSpeeds: removeLastSegmentSpeed(modification.segmentSpeeds)
      }
    }
  } else {
    // If we cut the segment we need to create two line strings
    const seg0 = segments[index - 1]
    const seg1 = segments[index]
    const line = await getLineString(
      coordinatesFromSegment(seg0),
      coordinatesFromSegment(seg1, true),
      {followRoad}
    )

    segments.splice(index - 1, 2, {
      fromStopId: seg0.fromStopId,
      geometry: line,
      spacing: seg0.spacing,
      stopAtEnd: seg1.stopAtEnd,
      stopAtStart: seg0.stopAtStart,
      toStopId: seg1.toStopId
    })

    // Splice out a segment speed
    const spliceSegmentSpeed = (ss) => {
      if (ss.length > index) {
        ss.splice(index, 1)
      }

      return extendSegmentSpeedsTo(ss, newSegmentsLength)
    }

    if (modification.type === ADD_TRIP_PATTERN) {
      return {
        segments,
        timetables: modification.timetables.map((tt) => ({
          ...tt,
          segmentSpeeds: spliceSegmentSpeed(tt.segmentSpeeds)
        }))
      }
    } else {
      // type === REROUTE
      return {
        segments,
        segmentSpeeds: spliceSegmentSpeed(modification.segmentSpeeds)
      }
    }
  }
}

/**
 * Insert a stop at the specified position.
 */
async function insertStop(
  latlng: LatLng,
  index: number,
  modification: Modification,
  followRoad: boolean,
  snapStop: null | GTFS.Stop
): Promise<Partial<Modification>> {
  const coordinates = snapStop
    ? [snapStop.stop_lon, snapStop.stop_lat]
    : [latlng.lng, latlng.lat]
  const stopId = snapStop?.stop_id

  const segments = getSegments(modification)
  const sourceSegment = segments[index]
  const line0 = await getLineString(
    coordinatesFromSegment(sourceSegment),
    coordinates,
    {followRoad}
  )
  const line1 = await getLineString(
    coordinates,
    coordinatesFromSegment(sourceSegment, true),
    {followRoad}
  )

  const newSegments: CL.ModificationSegment[] = [
    ...segments.slice(0, index),
    {
      fromStopId: sourceSegment.fromStopId,
      geometry: line0,
      spacing: sourceSegment.spacing,
      stopAtEnd: true,
      stopAtStart: sourceSegment.stopAtStart,
      toStopId: stopId
    },
    {
      fromStopId: stopId,
      geometry: line1,
      spacing: sourceSegment.spacing,
      stopAtEnd: sourceSegment.stopAtEnd,
      stopAtStart: true,
      toStopId: sourceSegment.toStopId
    },
    ...segments.slice(index + 1)
  ]

  // Determine new segment speeds
  const insertSpeed = (ss) => {
    if (ss.length > index) {
      const duplicateSpeed = ss[index]
      ss.splice(index + 1, 0, duplicateSpeed)
    }

    return extendSegmentSpeedsTo(ss, newSegments.length)
  }

  if (modification.type === ADD_TRIP_PATTERN) {
    return {
      segments: newSegments,
      timetables: modification.timetables.map((tt) => ({
        ...tt,
        segmentSpeeds: insertSpeed(tt.segmentSpeeds)
      }))
    }
  } else {
    // type === REROUTE
    return {
      segments: newSegments,
      segmentSpeeds: insertSpeed(modification.segmentSpeeds)
    }
  }
}

function flattenSegments(segments: CL.ModificationSegment[]): L.LatLng[][] {
  const flattenedCoordinates: LatLng[][] = []
  for (const segment of segments) {
    if (segment.geometry.type === 'LineString') {
      flattenedCoordinates.push(
        segment.geometry.coordinates.map((c) => lonlat.toLeaflet(c) as L.LatLng)
      )
    }
  }
  return flattenedCoordinates
}

function getControlPointsForSegments(
  segments: CL.ModificationSegment[]
): ControlPoint[] {
  const controlPoints: ControlPoint[] = []
  for (let i = 0; i < segments.length; i++) {
    if (!segments[i].stopAtStart) {
      controlPoints.push({
        position: lonlat.toLeaflet(coordinatesFromSegment(segments[i])),
        index: i
      })
    }

    if (i === segments.length - 1 && !segments[i].stopAtEnd) {
      controlPoints.push({
        position: lonlat.toLeaflet(coordinatesFromSegment(segments[i], true)),
        index: i + 1
      })
    }
  }
  return controlPoints
}
