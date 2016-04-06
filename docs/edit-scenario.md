# Editing transport scenarios

Transport scenarios in Scenario Editor are made up of a series of modifications of various types. When all the modifications
are strung together, they represent a new state of the transport system in a region. This page describes the available modification
types; each type also has an individual page describing the specifics of how to use it.

After uploading a bundle and creating a project, you will arrive at a screen that looks like this, which you use to edit the transport scenario:

<img src="../img/new-project.png" />

A transport scenario is made up of many modifications, each of which represents a single operation on the transit network (for example adding a line, or adjusting
the speed of an existing line). All modifications are listed in the right-hand bar. Each modification has a name, which is the top text box. This name can
be used to help keep track of the intent of different modifications. Above each modification are several controls. The map icon controls whether that modification
is currently displayed on the map, and the caret allows expanding or collapsing the modification to save space on the display. The large red X will delete a modification:

<img src="../img/modifications.png" alt="Modifications display" />

Oftentimes, there will be several scenarios that are very similar, differing only in a few minor aspects. In particular, one scenario is often
a superset of another (for instance, there is a base scenario which involves building six new rail lines, and another scenario which additionally
involves building four more). Instead of having to code each scenario separately, we support the concept of scenario variants. You can create variants
by clicking the "Create" button under "Variants," and entering a name for each variant. There are also buttons to show only the modifications belonging
to a particular variant on the map, or expand the modifications which are part of a variant.

<img src="../img/variants-editor.png" />

Within each modification you can then choose which variants it is active in:

<img src="../img/variants-chooser.png" />

## Available modification types

- [Add trip patterns](#add-trip-patterns)
 - [Importing shapefiles](#importing-shapefiles)
- [Remove trips](#remove-trips)
- [Remove stops](#remove-stops)
- [Adjust speed](#adjust-speed)
- [Adjust dwell time](#adjust-dwell-time)
- [Change frequency](#change-frequency)
- [Add stops](#add-stops)

## Add trip patterns

The add trip patterns modification allows you to add new [trip patterns](../glossary#trip-pattern) to your transport scenario. Generally
this would be used to model new routes, adding all of the trip patterns on the route. After creating the modification you will see this view:

<img src="../img/new-add-trip-patterns.png" alt="a new add trip patterns modification" />

Here you can enter a name for the modification, and click "edit route geometry" to edit the alignment of the route. After clicking that, you will see
the view below. You can also specify whether the modification is bidirectional. If this checkbox is checked, vehicles will travel in both directions
along the described geometry. If it is left unchecked, vehicles will only travel in the direction the line is drawn (which can be useful when there are couplets
or other aspects of the route that don't follow the same alignment in both directions).

<img src="../img/blank-geometry.png" alt="the route alignment editor on a new route" />

Click once on the map to place the first stop, then again to place the second stop, and so on. If you click on an existing stop, the icon will be blue and
the new transit service will stop at that existing stop. If you click in a place where there is not an existing stop, a new stop will be created. Using the
control panel at the upper right you can control whether stops are automatically created at a particular spacing, what that spacing is, whether clicks on
the maps should generate stops or just "control points" (which are points that the alignment passes through but doesn't stop at), and whether clicks should extend the
end of the line or the start of the line. Stops are shown on the map with bus stop icons, while control points are shown as blue circles.

<img src="../img/edit-geometry-start.png" alt="the edit route geometry view" />

If you want to edit the alignment to follow the roads, drag any part of the alignment to the path you would like it to take. This creates a control point, unless you
drag the line onto an existing stop (which will cause the line to visit that stop). It's important to get the alignment approximately correct so that the length of each
segment is correct when used to calculate the travel times between stops.

To insert a stop into the middle of an alignment, first drag the alignment to the appropriate location, then click on the created control point and choose "make stop":

<img src="../img/make-stop.png" alt="make a new stop" />

When you are done, click "close and save" in the editing control panel in the upper right of the map.

Once you have created an alignment, you need to specify when the routes run. You can do this by clicking "Add timetable" in the right-hand bar. (Note that you should save and close
the alignment editor before doing this.) You will see this view:

<img src="../img/add-timetable.png" alt="add timetable" />

Here you can specify the days of service, span of service, frequency, speed and dwell time. You can add as many timetables as you need to specify different frequencies or speeds at
different times of days.

### Importing shapefiles

Instead of using the built-in transit editor, it is also possible to import a shapefile from GIS. The advantage to using the built-in editor is that it gives much more fine-grained
control over stop locations; shapefiles are simply imported with stops created automatically at a particular spacing. To import a shapefile, first prepare a file where each route is
represented by a single line feature. It should have properties for the frequency (in minutes) and speed (in kilometers per hour) of each line. Then, zip the components of the
shapefile (`.shp`, `.dbf`, `.prj`, etc.) together. Click "Import Shapefile" in Scenario Editor:

<img src="../img/import-shapefile-button.png" alt="Import shapefile button" />

The following dialog will appear (some fields will not be visible until a shapefile has been chosen). In the dialog, specify what fields contain the speed and frequency of the new lines,
what field should be used to name the modifications, and what the stop spacing on the new lines should be. You can also specify whether the lines are bidirectional or not (that is, whether
there is a separate feature for the reverse direction or not). Once you click "import," a new Add Trip Pattern modification will be present for each feature in the inout shapefile, with a skeleton
timetable already filled out. You can edit this timetable, or add more.

<img src="../img/imported-pattern.png" alt="The timetable for an imported pattern" />

You can also click on "edit route geometry" to edit the alignment and stop positions of imported patterns. Particularly if the stop spacing is long, it makes sense to edit
the stop locations so that there are stops at major destinations and transfer points (consider a line with 1 kilometer stop spacing, where the stops near a major transfer point
are 500m away; this will add significant unnecessary walking and bias the resuts).

The transit data used in this demo came from [WMATA](http://wmata.com) and [DC GIS](http://octo.dc.gov/service/dc-gis-services).

## Remove trips

Another common modification is to remove trips. The most common use is to remove entire routes, but it is also possible to remove only specific patterns on a particular routes.
In order to remove trips, create a new Remove Trips modification, and select a GTFS feed, route, and optionally the trip pattern of the trips to be removed. All trips on this
route/pattern combination will be removed, and the route will be shown in red on the map. Note that the "active in variants" selector always specifies whether the modification is active,
so in this case implies that the trips will be removed from the selected variants.

<img src="../img/remove-trips.png" alt="Remove trips" />

## Remove stops

It is also possible to remove some of the stops from a route, while leaving the rest of the route untouched. To do this, create a new Remove Stops modification, and select a feed, route, and
patterns as you did when removing trips. You can then use the map to select which stops to remove. Under "Selection," click "new", "add to," or "remove from" to select new stops to remove, add to
the existing selection, or remove from the existing selection. Stops that are selected for removal are listed at the bottom of the modification, as well as being highlighted in red on the map.

<img src="../img/remove-stops.png"  alt="Remove stops" />


## Adjust speed

Sometimes you will want to adjust the speed on a route, or a portion of it (for instance due to the addition of dedicated bus lanes, or an application of transit signal priority).
As before, you will create the modification and select a feed, routes and patterns. If you want to modify only part of the route, you can use similar selection tools to those used in the
remove stops (with new selection, add and remove buttons). The difference is that you are now selecting [hops](../glossary/#hops). The selected segment will be shown on the map in purple.
Finally, enter a scale, which is the factor to multiply the speed by. For instance, if you enter 2, vehicles will travel twice as fast between stops (this modification does not affect dwell times;
to model changes in dwell time, see the adjust dwell time modification below).

<img src="../img/adjust-speed.png" alt="Adjusting the speed of a portion of a transit line" />

## Adjust dwell time

You may also want to adjust the dwell time along a route or at a particular stop, for example to model the effects of offboard fare collection, or the effects of increasing ridership at a particular
stop. As with the remove-stops modification, you can select a feed, route and optionally patterns. You can then use the map to select the affected stops (if you skip this step, all stops will have their
dwell times adjusted). You can then choose to either enter a new dwell time (in seconds), or scale the existing dwell times (for instance, entering 2 would double exiting dwell times).

<img src="../img/adjust-dwell-time.png" alt="Adjusting the dwell time at particular stops on a route" />

## Change frequency

Often a scenario will include frequency changes to existing lines. We support this using the change frequency modification. First, create a change frequency modification, and choose
the feed and route you want to adjust the frequency of.

<img src="../img/new-change-frequency.png" alt="Selecting the route on which to change frequencies" />

You then create any number of frequency entries, which represent a particular frequency on a particular trip pattern at a particular time of day. Typically, there will be at least
two entries (one for each direction). You must create frequency entries for all of the service you want to retain on a particular route, as all existing trips will be erased.
A frequency entry is shown below. Here, you choose a template trip for the frequency entry, which determines the stop-to-stop travel times of the trips that are created with the
given frequency. Oftentimes, travel time will vary throughout the day due to varying traffic and passenger loads, so it makes sense to choose a template trip that is representative
of the time window for which you are creating frequency service. You can filter the list of possible template trips by choosing a trip pattern.

You then specify the parameters of the frequency entry: what days it runs on, the frequency of the trip, and the start and end time. Repeat this process until you have created frequency entries
for all the service you want to retain, in both directions. The software will let you specify overlapping frequency windows, but keep in mind that this means that trips on _both_ entries
will operate at the specified frequencies (e.g., if you have a ten-minute frequency and a 15-minute frequency overlapping, there will be one set of vehicles coming every ten minutes,
and another, independent, set coming every 15).

<img src="../img/frequency-entry.png" alt="Editing a frequency entry" />

## Add stops

It is also possible to add stops to a route (i.e. reroute the route). You can do this at the beginning or end of a route, or have a reroute in the middle.
First, create an Add Stops modification, and select a route and patterns (as before). You then select the start and end stop of the reroute (i.e. where the route begins
and ends its deviation from the its existing pattern). Note that you will need to select patterns appropriately and create one reroute for each direction of the route;
a reroute can apply to multiple patterns in a single direction as long as they both contain the start and end stop in order. You select a stop by clicking the select stop
button, and then choosing the stop on the map. If you leave the from stop blank, the entire route up to the from stop will be rerouted. If you leave the to stop blank, the entire route
after that point will be rerouted. This can be used to extend routes, or to divert the ends of routes (e.g. to new rail stations).

<img src="../img/add-stops.png" alt="Adding stops" />

You can then edit the alignment and the intermediate stops by clicking on "Edit Alignment." This uses the same tools that are used when adding trip patterns. Be sure to close the map editor
before adjusting parameters in the right-hand bar.

This modification is displayed on the map with the route being modified in gray, any segments that are being replaced in red, and the new segments in blue.

<img src="../img/add-stops-map.png" alt="An extensive reroute displayed on the map" />



