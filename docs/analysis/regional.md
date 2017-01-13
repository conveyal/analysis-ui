After a regional analysis has completed, you can access it by selecting it from the main analysis screen.
Upon selecting a regional analysis, you will see a screen like the following:

<figure>
  <img src="../../img/regional.png" />
  <figcaption>Viewing a regional analysis</figcaption>
</figure>

The map shows the average accessibility experienced at each location, with the legend to the left.
This is the number of opportunities reachable from each location within the travel time budget
used to create the analysis. You can view the parameters used to create this regional analysis by
clicking on the "<title of regional analysis> settings" button below the legend to unfold the settings
used for the analysis. You can also export a regional analysis to GIS in GeoTIFF format in order to create
publication-quality maps using the download link.

# Comparing regional analyses

You can also compare two regional analyses from different scenarios in the same project by selecting
a comparison scenario. The map will show the differences in the averages between the two analyses,
with blue areas showing increased average job access, and red areas showing decreased average job access
relative to the comparison analysis.

You can also filter the displayed locations by the probability of improvement. When we compare two scenarios,
some of the differences in the averages is due to changes in the network, and some of it is due to uncertainty
in the scenario. By dragging the minimum improvement probability slider above zero, you can filter what
is displayed on the map by the probability of improvement. We compute this by sampling from the distributions
of accessibility (displayed as histograms in the main analysis mode) and computing how often the
active regional analysis has higher accessibility than the comparison regional analysis at each location,
and show only those locations where the active regional analysis is higher than the comparison at
least the selected proportion of the time. Note that this is taking into account the variation due to
departure time as well, so similar to the difference spectrogram, for the probability of improvement
at a given location to be 1, the best possible user experience
(i.e. the maximum accessibility, realized through minimal waiting for transit vehicles at a particular time
  of departure within the specified time window) in the comparison regional analysis must be worse than the worst possible user experience
experienced in the active regional analysis.
