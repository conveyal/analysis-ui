# Frequently Asked Questions

### When starting an analysis, why does the "initializing cluster" message persist for so long?

Three steps need to take place when starting a new analysis.

First, the main Analysis server must request and initialize a computation cluster from Amazon Web Services.  For scalability, we start a "worker" server for each [transport network](../glossary.html#transport-network) being analyzed.  This means that even if you are already successfully fetching analysis results for a project, a new server will be needed if you switch to a project associated with a different GTFS bundle or region, or if you change the routing engine.  

Second, the worker server needs to set up a transport network.  The server checks whether the required transport network is already built and available for download from Amazon S3.  If it is, the server downloads it and proceeds to the next step.  If a pre-built network cannot be downloaded, the server downloads the required input files (OSM extract and GTFS bundle).  It will then build the transport network by combining the road and transit layers, which can be a lengthy process (on the order of 10 minutes for large regions, and an hour for very large regions with dense networks).  To avoid having to repeat this step, the server will upload the built network to S3 for future use.

Third, once a transport network is downloaded or built, certain caching operations related to access mode (e.g. walking or biking) need to be completed. We're currently working on some optimizations for this step, so you still may see some time-out errors on your first analyses or when switching access modes. Refreshing your browser page should resolve the issue.

By default, servers check for activity about every hour after starting up, and they automatically shut down if there is no recent activity.  If you need us to override this default shutdown behavior for critical analyses, get in touch with your support team.

### How long should each regional analysis take?

The time required to complete a regional analysis is a function of the size of the region, number of origins, and size and complexity of the transit network. Generally, computation is slower for routes specified as add-trip modifications than for routes specified in the baseline GTFS bundle. If frequency-based routes are present in the scenario's add-trip modifications or the base GTFS, compute time will also depend on the number of simulated schedules (Monte Carlo draws).

Additional servers start automatically once a results for few origins in a regional analysis have completed successfully. The number of additional servers is a function of the number of origins, with a default cap set to approximately 100.  If you need a higher cap to complete a large batch of analysese quickly, contact your support team.

### Who can see and edit my projects?

All authorized users within an organization have access to that organization's regions, projects, and scenarios.  Multiple users should not edit or analyze the same project concurrently.  If multiple users try to edit the same modification simultaneously, or if you have Conveyal Analysis open in multiple browser tabs, you may see "data out of date" errors.
