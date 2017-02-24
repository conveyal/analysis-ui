It is also possible to remove some of the stops from a route, while leaving the rest of the route untouched. To do this, create a new Remove Stops modification, and select a feed, route, and
patterns as you did when removing trips. You can then use the map to select which stops to remove. Under "Selection," click "new", "add to," or "remove from" to select new stops to remove, add to
the existing selection, or remove from the existing selection. Stops that are selected for removal are listed at the bottom of the modification, as well as being highlighted in red on the map.

You can also specify that you wish to remove a certain amount of time at each removed stop (in addition to the
dwell time specified in the original feed, which is automatically removed). This could be used to account
for acceleration and deceleration, and can also be used when the original feed does not specify dwell time.
This feature is useful when testing the effects of stop consolidation.

When removing the beginning of a route, the dwell times at each stop are removed, as is any time
specified to be removed at each removed stop. Any remaining travel time is preserved as an offset
from the start of the trip in the original GTFS to the start of trips at the new first stop. This is
effectively as if the vehicles were leaving the original terminal at the same time but deadheading
past all of the removed stops.

This modification does not take into account the possibility of increased frequency due to more efficient
routes. However, it can be paired withe a change frequency modification to model that scenario.

<img src="../../img/remove-stops.png"  alt="Remove stops" />
