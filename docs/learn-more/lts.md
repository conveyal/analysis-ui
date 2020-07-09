# Cycling Level of Traffic Stress LTS

## Analyzing LTS

When analyzing access by cycling, you may want to limit use of streets that most riders would consider dangerous or stressful. Different researchers have proposed various ways of quantifying stress for cyclists:

* [Level of Traffic Stress](http://transweb.sjsu.edu/research/low-stress-bicycling-and-network-connectivity) (LTS), developed by researchers at the Mineta Transportation Institute
* [Surrogate LTS](https://blog.conveyal.com/better-measures-of-bike-accessibility-d875ae5ed831), developed by Conveyal for contexts where no data beyond OpenStreetMap (OSM) are available

When cycling is enabled in Conveyal Analysis, varying the Max Level of Traffic Stress limit can provide insights into gaps in a region’s cycling infrastructure. Setting Max LTS to 1 in an analysis will allow cycling only on separated bicycle infrastructure or low-traffic streets; routing will revert to walking when traversing any links with LTS exceeding 1. Setting Max LTS to 3 in an analysis will allow cycling on links with LTS 1, 2, or 3. Differences in access between these two analyses may highlight places where new dedicated cycling infrastructure could improve access for cyclists with lower tolerances for stressful conditions.

## Labeling Network Edges with LTS

### Conveyal Surrogate LTS

Conveyal Surrogate LTS is the default methodology in Conveyal Analysis for labeling network links based on commonly tagged attributes of OSM ways. The labeling logic in v5.9.0 of the routing engine can be viewed in its [source code](https://github.com/conveyal/analysis-backend/blob/v5.9.0/src/main/java/com/conveyal/r5/labeling/LevelOfTrafficStressLabeler.java) and is summarized below:
* If way has tag highway:service, do not label edge
* If way does not allow cars or has tags highway:residential or highway:living_street, label edge as LTS 1
* If speed limit is less than 40.25 kph, and the number of lanes is less than 4 or unspecified, label edge as LTS 2
* If way has tag highway:unclassified, highway:tertiary, or highway:tertiary-link, and the number of lanes is less than 4 or there is cycleway tag for the correct direction, label edge as LTS 2
* Otherwise, if there is a cycleway tag for the correct direction, label edge as LTS 3
* Otherwise, label edge as LTS 4

LTS at intersections is incorporated by assigning incoming edges the highest LTS of any of the edges entering the intersection, unless there is a traffic signal at the intersection.

### Custom LTS

To override the default method, you can pre-process OSM before uploading by adding the tag "LTS=" with numbers 1-4.