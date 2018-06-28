# Glossary

### routing engine

[Conveyal R5](https://github.com/conveyal/r5) is the core computational software behind Conveyal Analysis.  It performs one-to-many searches on multimodal (transit/bike/walk/car) transport networks.

### transport network

A routable network with transit and road layers, built by a specific version of R5. The transit layer is built from a GTFS bundle and the road layer is built from the OpenStreetMap network associated with a region.

### trip pattern

A sequence of stops visited by a transit vehicle. A trip pattern can have many trips, and a route consists of a one or more trip patterns.

### trip

A single vehicle trip, representing a vehicle visiting the stops on a particular trip pattern at a particular time.

### hop

A portion of a trip consisting of a transit vehicle traveling between two consecutive stops.
