The add trips modification allows you to add new [trip patterns](/glossary#trip-pattern) to your transport scenario. Generally
this would be used to model new routes, adding all of the trip patterns on the route. After creating the modification you will see this view:

<img src="/img/new-add-trip-pattern.png" alt="a new add trips modification" />

Here you can enter a name for the modification, as you can with any modification. You can also specify whether the modification is bidirectional. If this checkbox is checked, vehicles will travel in both directions
along the described geometry. If it is left unchecked, vehicles will only travel in the direction the line is drawn (which can be useful when there are couplets
or other aspects of the route that don't follow the same alignment in both directions). You can choose whether stops should be created automatically at a specified interval
along the route, or if you will create all stops manually. To create an alignment for the modification (or to edit the alignment you've previously created), click the 'Edit route geometry'
button. The 'Edit route geometry' button will change to a 'Stop editing' button, and you will then see this view.

<img src="/img/blank-geometry.png" alt="the route alignment editor on a new route" />

Click once on the map to place the first stop, then again to place the second stop, and so on. If you click on an existing stop (indicated by a gray circle), the
icon for the new stop will be blue and
the new transit service will stop at that existing stop. If you click in a place where there is not an existing stop, a new stop will be created.  

<img src="/img/trip-drawn.png" alt="a new trip drawn in the editor" />

If you want to edit the alignment to follow particular features, drag any part of the alignment to the path you would like it to take. This creates a "control point" which the route
passes through but does not stop at. It's important to get the alignment approximately correct so that the length of each
segment is correct when used to calculate the travel times between stops. If you are modeling an on-street route, you can check the box that says "follow streets" to
make the route follow the streets. This only applies to segments that are actively being edited, and will not cause already drawn segments to follow the streets,
allowing you to draw part of a route on street and part off-street.

To insert a stop into the middle of an alignment, first drag the alignment to the appropriate location, then click on the created control point and choose "make stop." You can also convert undesired stops into control points, or delete them, in this view.

<img src="/img/make-stop.png" alt="make a new stop" />

When you are done, click "stop editing" in the right sidebar

Once you have created an alignment, you need to specify when the routes run. You can do this by clicking "Add timetable" in the right-hand bar. (Note that you should save and close
the alignment editor before doing this.) You will see this view:

<img src="/img/new-timetable.png" alt="add timetable" />

Here you can specify the days of service, span of service, frequency, speed and dwell time. You can add as many timetables as you need to specify different frequencies or speeds at
different times of days.

You can additionally choose whether the frequency entry represents an assumed headway, or represents the
exact schedule, using the "Times are exact" checkbox. For example, consider an entry specifying that
a particular pattern runs every 15 minutes from 9 AM until 7 PM. If the checkbox is left unchecked,
the software will assume that vehicles depart the first stop on the route every 15 minutes between
9 AM and 7 PM, but with no assumptions as to exactly when that will happen. For example, vehicles might
leave at 9:02, 9:17, 9:32, and so on, or they might leave at 9:10, 9:25, 9:40, etc.; many of these possibilities
will be tested and averaged in order to get a complete picture of how different possible schedules
might perform. This option should be chosen when a frequency is known but a schedule has not yet been
written for a future system.

In the rare case in which the complete schedule is known at the time of scenario creation, the "Times are exact"
checkbox can be activated. In this case, a single schedule will be created, with the first departure
at the start time, and then additional departures with exactly the specified frequency until (but not
including) the end time. For example, in the scenario given above, the vehicles would be scheduled
to depart at exactly 9:00, 9:15, 9:30 until 6:45 (not at 7:00 because the end time is not included).

You can delete this or any modification using the red "Delete Modification" button.
