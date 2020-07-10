# Park and Ride

When transit modes are selected in analysis, park-and-ride can be selected as an access mode. Park-and-ride access uses locations identified based on certain OSM tags in the street layer of the baseline network, specifically areas and ways tagged with park_ride=* or parking=park_and_ride tags.

This access mode requires the car to be parked and transit to be used before the journey is complete. Therefore the isochrones do not radiate out from the origin point; they radiate out from the destination transit stops that can be reached by parking the car, walking to a transit stop, riding a transit vehicle, then exiting transit.
