# Preparing baseline network

Start by gathering [GTFS](../glossary.html#GTFS) files for the transit agencies whose service will be included in your scenarios. If there is no GTFS available for your region, as a workaround you can use a valid GTFS feed from somewhere else in the world, follow the steps below, then attempt to [import route alignment shapefiles](../edit-scenario/index.html#importing-modifications-from-shapefiles) representing service in your region.

## Setting up a new region

From the initial login page, set up a new region by clicking
<br><span class="btn btn-success"><i class="fa fa-plus"></i> Set up a new region</span>

If any regions have already been created, they will be shown in a list below this button.

When setting up a new region, enter a name and specify boundaries by moving the bounding box on the map. You must also upload an appropriate OpenStreetMap (OSM) extract in this view, which will serve as the road layer of the transport network. OSM extracts can be downloaded from services such as [Geofabrik](http://download.geofabrik.de) or [Nextzen](https://metro-extracts.nextzen.org/).  

### Cropping an OSM extract
To reduce computation time, we suggest cropping your OSM extract to the extent of your region.  If you have [osmconvert](https://wiki.openstreetmap.org/wiki/Osmconvert#Binaries) installed on your computer, you can copy the crop command shown in the panel, paste it to your local command line, run it, and upload the resulting cropped OSM file.

## Uploading a GTFS bundle

On the main page for a region, upload your first bundle of GTFS feeds by clicking:
<br><span class="btn btn-success"><i class="fa fa-database"></i> Upload a new GTFS Bundle</span>

You can also click this icon on the sidebar to access GTFS Bundles:
<br><span class="ui-icon"><i class="fa fa-database"></i> GTFS Bundles</span>

This will take you to the GTFS Bundles page, where you can give the Bundle a name and choose .zip files to upload. If you have multiple GTFS feed .zip files, you can select them by shift-clicking, control-clicking or command-clicking (depending on your browser/operating system).  Finally, click the create button to confirm.

## Creating a Project

Uploading and processing a bundle may take several minutes.  Once processing is complete, on the Projects page, click:
<br><span class="btn btn-success"><i class="fa fa-plus"></i> Create new Project</span>

This will take you to the Create new Project page, where you can give the Project a name, select a bundle to which the project will be associated, and click the create button to confirm. You are now ready to move on to [editing scenarios](../edit-scenario).
