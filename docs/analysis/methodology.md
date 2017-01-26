This is a summary of the methodology used in Conveyal Analysis. For a more complete treatment of the
subject, please see Conway, Matthew Wigginton, Andrew Byrd, and Marco van der Linden. “Evidence-Based Transit and Land Use Sketch Planning Using Interactive Accessibility Methods on Combined Schedule and Headway-Based Networks.” _Transportation Research Record_ 2653 (2017). doi:10.3141/2653-06.

Our method to compute accessibility works by exhaustively planning trips from an origin to all destinations
in the analysis area. Those destinations are cells of a fine regular grid. We project all uploaded
opportunity data into this grid. When we plan trips to each cell, we then simply sum the opportunity
values of all cells that are within the travel time threshold.

However, you may recall that we don't compute a single travel time but rather look at the travel time
over a time window. To do this, we compute the travel times for a trip departing at each minute within
the time window (for example 7:00, 7:01, 7:02&nbsp;.&nbsp;.&nbsp;.&nbsp;8:59 for a 7:00–9:00 time window).
We then compute the accessibility at each minute and use that to compute the distributions of accessibility.

When we have routes that do not have schedules (i.e. they are specified with only frequencies), we
generate a large number of random schedules with the specified headway and test all of them. This allows us to compute a distribution
considering that the new lines may or may not be well synchronized with other (new or existing) lines in the system.

When an average is desired, we average all of these accessibility values together.
There is one issue with this approach to averaging, which has to do with the fungibility of opportunities.
Let's consider for a moment jobs. This, however, treats opportunities as being completely fungible, even on
a day-to-day basis. Consider a location which has infrequent trains in two directions. During the
first half of each hour, 100,000 jobs in a city to the south can be reached within the travel time
budget, and during the second half of each hour, 100,000 jobs in a city to the north can be reached.
If accessibility is computed at each minute and averaged, the result will be that 100,000 jobs are
accessible at the average departure minute. While strictly true given the definitions above, this
suggests a situation in which people choose their job based on what time they happen to leave
home.
