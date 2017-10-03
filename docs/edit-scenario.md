# Editing transport scenarios

Transport scenarios in Scenario Editor are made up of a series of modifications of various types. When all the modifications
are strung together, they represent a new state of the transport system in a region. This page describes the available modification
types; each type also has an individual page describing the specifics of how to use it.

After uploading a bundle and creating a project, you will arrive at the screen below, where you can create different scenarios that may represent

<figure>
  <img src="../img/create-scenario.png" />
  <figcaption>Creating a new scenario</figcaption>
</figure>

A transport scenario is made up of many modifications, each of which represents a single operation on the baseline transit network (for example adding a line, or adjusting
the speed of an existing line). All modifications are listed in the left-hand bar. Each modification has an eye icon next to it, which controls whether it is currently
displayed on the map. Clicking on the title of a modification will open it and allow you to edit it.

You can return to the Edit Scenario page by clicking on the pencil icon in the sidebar.

<figure>
  <img src="../img/edit-scenario.png" />
  <figcaption>Editing a scenario</figcaption>
</figure>

Oftentimes, there will be several project alternatives that are very similar, differing only in a few minor aspects. In particular, one project is often
a superset of another (for instance, there is a project which involves building six new rail lines, and another alternative which additionally
involves building four more). Instead of having to code modifications multiple times for each alternative, you can activate modifications in different scenarios. You can create scenarios
by clicking the "Create" button to the right of "Scenarios" and entering a name. The buttons at the right of the list of scenarios allow renaming the scenarios and showing or hiding them on a map.

Scenarios can be exported as .json by clicking the download icon next to modifications, or in a printer-friendly format by clicking the printer icon.

<figure>
  <img src="../img/variant-editor.png" />
  <figcaption>Editing the variants of a scenario</figcaption>
</figure>

<figure>
  <img src="../img/variant-chooser.png" />
  <figcaption>Choosing the variants a modification is active in</figcaption>
</figure>

## Available modification types

- [Add trips](modifications/add-trips)
- [Remove trips](modifications/remove-trips)
- [Remove stops](modifications/remove-stops)
- [Adjust speed](modifications/adjust-speed)
- [Adjust dwell time](modifications/adjust-dwell-time)
- [Adjust frequency](modifications/adjust-frequency)
- [Reroute](modifications/reroute)

## Importing modifications from another scenario

Occasionally, you may want to copy all of the modifications from one scenario into another. This may
be useful to make a copy of a scenario, or to combine scenarios developed by different team members
into a single scenario (for instance, one team member working on rail changes and another on bus changes).
To do this, click the arrow icon to the right of the scenario name <i class="fa fa-upload"></i>.

<figure>
  <img src="../img/select-import-modifications.png" />
  <figcaption>Selecting that you want to import modifications from another scenario.</figcaption>
</figure>

You can then
choose the scenario you wish to import modifications from. Only scenarios which use the same bundle
(base GTFS data) will be available. All modifications will be imported; when there are multiple variants,
the variants in the scenario being imported will be mapped directly to the variants in the scenario being
imported to (i.e. modifications in the first variant will remain in the first variant in the new scenario).

<figure>
  <img src="../img/import-modifications.png" />
  <figcaption>Importing modifications from another scenario</figcaption>
</figure>

## Importing modifications from Shapefiles

In general, it is best to create all modifications directly in this editing tool as it allows full control
over all aspects of transit network design. However, on occasion, it may be desirable to import modifications
from a GIS shapefile. If you have a Shapefile containing lines, you can upload it to Conveyal Analysis
and have it turned into a set of Add Trips modifications. You first need to zip the components of the
shapefile, then you can select the "Import shapefile" <i class="fa fa-globe"></i> button to the right
of the scenario name.

<figure>
  <img src="../img/select-import-modifications-from-shapefile.png" />
  <figcaption>Selecting that you want to import modifications from a Shapefile</figcaption>
</figure>

Once you have entered the Import Shapefile view and selected a zipped Shapefile, you will see the following.

<figure>
  <img src="../img/import-modifications-from-shapefile.png" />
  <figcaption>Importing modifications from a Shapefile</figcaption>
</figure>

There are several fields that must be filled in. The name of each modification is set from an attribute in the
Shapefile; the attribute used may be selected here. Additional, the speed (in km/h) and frequency (in minutes)
should be attributes in the Shapefile. Finally, since Shapefiles only contain the route geometry and
not the stop locations, stops will be created automatically. The stop spacing should be specified.
The generated stop positions may be individually edited after import, for example to place a stop at
a major transfer point.
