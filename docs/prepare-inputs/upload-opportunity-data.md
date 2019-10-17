# Preparing opportunity datasets

To measure access to spatially distributed opportunities (e.g. jobs, people, schools), you will need to ensure at least one **opportunity dataset** has been added to your project. To add or manage opportunity datasets, click this icon on the sidebar:
<br><span class="ui-icon"><i class="fa fa-th"></i> Opportunity Datasets</span>

## Uploading opportunity datasets

Opportunity datasets can be created by uploading shapefiles containing point features, shapefiles containing polygon features, or a CSV file with one point per row. In addition to the coordinates or geometries, uploaded files must have at least one numeric attribute or column specifying the opportunity count within each polygon or at each point. In CSV files with each row representing a single opportunity at a specific location, this numeric column should be filled with the number 1 (i.e. one opportunity at each point).

To start an upload, click: <br><span class="btn btn-success"><i class="fa fa-plus"></i> Upload a new opportunity dataset</span>

Enter a name for the opportunity dataset source, then select the appropriate files.

If you are uploading a shapefile, it should not be zipped. Select all of the files in the Shapefile when uploading (at the very least, `.shp`, `.shx`, `.dbf` and `.prj`). How you select multiple files depends on your browser and operating system, but generally will involve shift-clicking, control-clicking or command-clicking.

<figure>
  <img src="../img/upload-shapefile.png" />
  <figcaption>Uploading a Shapefile by selecting all constituent files</figcaption>
</figure>

If you select a CSV file (whose filename must end in `.csv`) two extra fields will appear in the interface, in which you must type the names of the latitude and longitude fields within the CSV. We currently only support CSV files which specify points in WGS 84 latitude/longitude coordinates. Many minor variants of the CSV format exist. Rather venturing a guess at which variant is being used, the system expects the file to adhere to a particular definition of CSV: fields should be separated by commas (rather than semicolons for example) and the first row should be a header row containing the names of the fields. The latitude and longitude field names you specify in the web UI should be detected in that header row.

Once you have done this, click the upload button to start the upload.  Opportunity datasets will be saved with the source name you entered and the attribute/column names of the uploaded files.

After processing is complete, you can refresh the page and see dot-density maps of your datasets, converted to the [analysis grid](../analysis/methodology.html#spatial-resolution) used in Conveyal Analysis.

## Avoiding common errors
* Eliminate extraneous attributes/columns from your shapefile/csv before uploading.
* Ensure entries are numeric, not text values (e.g. "N/A", numbers stored as text). Only columns with exclusively numeric entries will be saved.

## Managing opportunity datasets

Selecting an existing opportunity dataset from the dropdown menu will give you options to:
* <span class="btn btn-warning"><i class="fa fa-pencil"></i> Edit dataset name</span>
* <span class="btn btn-danger"><i class="fa fa-trash"></i> Delete this dataset</span>
* <span class="btn btn-danger"><i class="fa fa-trash"></i> Delete entire dataset source</span> (e.g. all attributes from a shapefile)

## LODES import

For projects in the United States, Census block-level data on employment and workforce from [LODES](https://lehd.ces.census.gov/data/#lodes) can be fetched by clicking: <br><span class="btn btn-info"><i class="fa fa-group"></i> Fetch LODES</span>

Note that as of the [August 2019 release](https://lehd.ces.census.gov/data/lodes/LODES7/LODESTechDoc7.4.pdf), 2017 data are missing for Alaska and South Dakota, and 2017 and 2016 data exclude federal employees.
