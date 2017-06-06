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
a comparison scenario. The map will show the differences in accessibility between the two analyses,
with blue areas showing increased accessibility, and red areas showing decreased accessibility,
relative to the comparison analysis.

You can also filter the displayed locations by the probability of change using the slider. When there are trips that
have headways rather than explicit timetables, the exact performance of the network, particularly the
transfer timing, is not known, and thus there is random variation in the results. In order to account for
this variation, we use a Monte Carlo approach of generating random timetables that meet the constraints
of the scenario. Thus, there is random variation in the accessibility numbers. We use a
statistical bootstrapping technique to estimate this variation and produce a _p_-value that a change
at a particular origin is due to the scenario, rather than simply random variation. We can use that _p_-value
to determine which changes are statistically significant. For instance, if
the slider is set at 0.98, only changes that we are 98% sure are not due to random variation will be shown.
The analyst should note that, given the large number of cells in a regional analysis, it is likely
that a small number of cells may show as having a 98% probability of change even when there is in fact no change.
Generally, changes that are in fact due to the scenario rather than due to random variation will appear
geographically clustered.

For more information, see the [methodology](/analysis/methodology) page.
