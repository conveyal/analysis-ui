# Frequently Asked Questions

### How long should it take to start a single-origin analysis?

Three steps need to take place when starting a new single-origin analysis.

First, the main Analysis server must request and initialize a compute cluster from Amazon Web Services.  For scalability, we start a "worker" server for each [transport network](../glossary.html#transport-network) being analyzed.  This means that even if you are already successfully fetching analysis results for a project, a new server will be needed if you switch to a project associated with a different GTFS bundle or region, or if you change the routing engine.  

Second, the worker server needs to set up a transport network.  It first checks whether the required transport network is already built and available for download from Amazon S3.  If it is, the server downloads it and proceeds to step 3.  If a pre-built network cannot be downloaded, the server downloads the required input files (OSM extract and GTFS bundle).  It then builds the transport network by combining the road and transit layers, which can be a lengthy process (on the order of 10 minutes for large regions, and an hour for very large regions with dense networks). To avoid having to repeat this step, the server will upload the built network to S3 for future use.

Third, once a transport network is downloaded or built, certain caching operations related to access mode (e.g. walking or biking) need to be completed. 

Recent routing engine versions provide status updates on these steps, including:
* _Starting routing server. Expect status updates within a few minutes._
  * Trigger: analysis using a project that has not been analyzed within the last hour
  * Expected duration: 2-3 minutes
* _Building network..._
  * Trigger: analysis using a new GTFS bundle, scenario, or routing engine version
  * Expected duration: 5-50 minutes, depending on size of transit network
* _Linking grids to the street network and finding distances..._
  * Trigger: analysis using an updated access mode or scenario
  * Expected duration: up to a few minutes, depending on extent of region
* _Performing analysis..._
  * Expected duration: a few seconds

By default, servers automatically shut down after one hour if inactivity.  If you need us to override this default shutdown behavior for critical analyses, get in touch with your support team.

### How long should each regional analysis take?

The time required to complete a regional analysis is a function of the size of the region, number of origins, and size and complexity of the transit network. Generally, computation is slower for routes specified as add-trip modifications than for routes specified in the baseline GTFS bundle. If frequency-based routes are present in the scenario's add-trip modifications or the base GTFS, compute time will also depend on the number of simulated schedules (Monte Carlo draws).

Additional servers start automatically once a results for few origins in a regional analysis have completed successfully. The number of additional servers is a function of the number of origins, with a default cap set to approximately 100.  If you need a higher cap to complete a large batch of analysese quickly, contact your support team.

### Why are travel times longer than expected?

Conveyal Analysis calculates door-to-door total travel time, including time spent accessing transit stops via streets, waiting at stops, riding in vehicles, and traveling from transit stops via streets to final destinations. 

Varying the travel time percentile can help you determine what role service frequency plays in waiting times (and therefore total travel times) for your network.

Another potential explanation for unexpectedly long travel times is that origins, destinations, and stops are all linked to the nearest edge in a network's street layer. This linking behavior can lead to unexpected results, especially for stops, origins, or destinations that are far from streets. Consider these examples:

* You place the origin directly on a transit stop with fast, frequent service, but travel times using the service show an unexpected delay. Because total travel time includes walking from the origin to the nearest street, then from the street layer (back) to the transit stop, there may be an unexpectedly long access time if the stop is far from a nearby street.
* You notice a very long transfer time between two nearby stops.  If these stops are linked to different street edges, and the street edges are only connected via a long, circuituous path, the walking time for the transfer will be unexpectedly long.

To avoid such issues, we suggest placing stops close to streets, and snapping to stops that exist in the baseline transit layer when feasible.

Uploaded OpenStreetMap data with poorly connected subnetworks may also lead to issues. If you notice strangely non-contiguous isochrones, they may reflect destinations being linked to such a subnetwork (e.g. a network of walking paths in a park that only connects to the rest of the street network at a few locations).

### Who can see and edit my projects?

All authorized users within an organization have access to that organization's regions, projects, and scenarios.  Multiple users should not edit or analyze the same project concurrently.  If multiple users try to edit the same modification simultaneously, or if you have Conveyal Analysis open in multiple browser tabs, you may see "data out of date" errors.
