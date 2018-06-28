# Preparing baseline network

Conveyal Analysis relies on [GTFS](https://developers.google.com/transit/gtfs/) feeds, .zip files with information about transit networks and schedules. Most transit agencies produce GTFS feeds to power customer-facing trip planning applications, but they are also useful for analysis. A first step is to gather GTFS files for the transit agencies whose service will be modified in your scenarios. If there is no GTFS available for your region, as a workaround you can upload a valid GTFS feed from somewhere else in the world and attempt to [import route alignment shapefiles](../edit-scenario/index.html#importing-modifications-from-shapefiles) representing service in the region.

## Setting up a new region

From the initial login page, set up a new region by clicking
<br><span class="btn btn-success"><i class="fa fa-plus"></i> Set up a new region</span>

If any regions have already been created, they will be shown in a list below this button.

When setting up a new region, enter a name and specify boundaries by moving the bounding box on the map. You must also upload an appropriate OpenStreetMap (OSM) extract in this view, which will serve as the road layer of the transport network. OSM extracts can be downloaded from services such as [Geofabrik](http://download.geofabrik.de) or [Nextzen](https://metro-extracts.nextzen.org/).

## Uploading a GTFS bundle

On the main page for a region, upload the GTFS feeds you prepared above by clicking
<br><span class="btn btn-success"><i class="fa fa-database"></i> Upload a new GTFS Bundle</span>

This will take you to the GTFS Bundles page, where you can give the Bundle a name and choose .zip files to upload. If you have multiple GTFS feed .zip files, you can select them by shift-clicking, control-clicking or command-clicking (depending on your browser/operating system).  Finally, click the create button to confirm.

## Creating a Project

Uploading and processing a bundle may take several minutes.  Once processing is complete, on the Projects page, click
<br><span class="btn btn-success"><i class="fa fa-plus"></i> Create new Project</span>

This will take you to the Create nwe Project page, where you can give the Project a name, select a bundle to which the project will be linked, and click the create button to confirm. You are now ready to move on to [editing scenarios](../edit-scenario).
