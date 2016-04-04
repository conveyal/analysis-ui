# Preparing data inputs for Scenario Editor

Scenario editor uses [GTFS](https://developers.google.com/transit/gtfs/) files as its input. These files contain information
about the existing transit service provided by an agency. Most transit agencies produce them to power customer-facing trip
planning applications, but they are also useful for analysis. A first step is to gather GTFS files for the tranasit agencies whose
service will be changing in your scenarios.

Once you've gathered GTFS data, you can log into scenario editor. To upload GTFS data, click on 'Create Bundle', select one or more GTFS
files, give the files a name, and click 'Upload.' You only need to do this once for each set of input data, even if you are creating multiple
scenarios based on the same data.

<img src="../img/upload.png" alt="upload bundle dialog" />

You can then create a new scenario by clicking on "Open Project," entering a name in the text field, and clicking "Create":

<img src="../img/create-project.png" alt="create project" />

You can re-open a project by clicking "Open Project" and selecting the name of the project.

Once you have done this, you can move on to [creating your scenario](edit-scenario).