# Adjust frequency

Often a scenario will include frequency changes to existing lines. We support this using the adjust frequency modification. First, create an adjust frequency modification, and choose
the feed and route you want to adjust the frequency of.

<img src="../../img/new-change-frequency.png" alt="Selecting the route on which to change frequencies" />

You then create any number of frequency entries, which represent a particular frequency on a particular trip pattern at a particular time of day. Typically, there will be at least
two entries (one for each direction).
A frequency entry is shown below. Here, you choose a template trip for the frequency entry, which determines the stop-to-stop travel times of the trips that are created with the
given frequency. Oftentimes, travel time will vary throughout the day due to varying traffic and passenger loads, so it makes sense to choose a template trip that is representative
of the time window for which you are creating frequency service. You can filter the list of possible template trips by choosing a trip pattern.

You then specify the parameters of the frequency entry: what days it runs on, the frequency of the trip, and the start and end time. Repeat this process until you have created frequency entries
for all the service you want to retain, in both directions. The software will let you specify overlapping frequency windows, but keep in mind that this means that trips on _both_ entries
will operate at the specified frequencies (e.g., if you have a ten-minute frequency and a 15-minute frequency overlapping, there will be one set of vehicles coming every ten minutes,
and another, independent, set coming every 15).

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

If the schedule is not known, but it is known that the schedules of two lines will be related, the
[phasing feature](phasing) may be enabled.

You can choose to remove all existing trips on the route (the default) or choose to retain trips outside the time windows in which you specify frequencies, which is useful
when you are changing the frequency for only part of the day (e.g. increased weekend frequency) and want to retain the existing scheduled service at other times. This is controlled using the "Retain existing scheduled trips at times without new frequencies specified" checkbox.

<img src="../../img/frequency-entry.png" alt="Editing a frequency entry" />
