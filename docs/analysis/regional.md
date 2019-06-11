# Regional analysis view

After a regional analysis has completed, you can access it by selecting it in the Regional Analysis view. Upon selecting a regional analysis, you will see a screen like the following:

<figure>
  <img src="../img/regional.png" />
  <figcaption>Viewing a regional analysis</figcaption>
</figure>

The map shows the accessibility experienced at each location, with the legend to the left. This is the number of opportunities reachable from each location within the travel time cutoff specified when creating the regional analysis.

## Downloading regional results

Using the download button, you can save regional analysis results in a raster format (GEOTIFF). These saved files can be opened in GIS to conduct additional analyses or create custom maps. In QGIS, you will likely want to [style](https://docs.qgis.org/2.8/en/docs/training_manual/rasters/changing_symbology.html#basic-fa-changing-raster-layer-symbology) the accessibility layer with a singleband pseudocolor scheme. If you prefer to work with the results as a regular grid of vector points, you may find the "Raster values to points" tool in the QGIS processing toolbox helpful. Downloading results also allows you to see the raw [grid cells](methodology.html#spatial-resolution) used for analysis, rather than the smoother interpolated results shown in your browser.

## Comparing regional analyses

You can also compare two regional analyses from different projects in the same region. The map will show the differences in accessibility between the two analyses, with blue areas showing increased accessibility, and red areas showing decreased accessibility, relative to the comparison analysis. Again, you can download raw results for the two analyses being compared for further styling and analysis in GIS.

## Measuring aggregate accessibility
These regional analyses present a wealth of information, and maps of regional accessibility are frequently the best way to communicate the accessibility impacts of a transit plan. However, in some cases there is a need to summarize accessibility in a single metric for the purposes of setting measurable goals in planning practice. Conveyal Analysis allows aggregating the results of a regional analysis to a larger area, for example a neighborhood, city or region. The result of this aggregation is a histogram of the accessibility experienced by residents of the aggregation area, as well as quantiles of the level of accessibility experienced by the population (e.g. 80% of residents have access to at least 500,000 jobs within a 45 minute transit commute). This latter metric can be used a single number to set goals in transportation planning.

In order to accomplish this aggregation, you first need to choose a region and code it as a polygon Shapefile (unprojected WGS84, CRS 4326). The choice of region can have a significant impact on the final metric. If a very large region is chosen, where much of the region does not have transit service, there will be a large number of people with very low job access via transit, deflating the aggregate numbers. Conversely, if a small region is chosen, segments of the population that should be served by transit will be excluded from the aggregate metrics. Conveyal Analysis will not accept aggregation areas larger than 2 square degrees.

Once you have created a Shapefile of your aggregation area, you need to upload it to Conveyal Analysis.
This can be done within the regional analysis view by selecting "Upload new aggregation area" under
the "Aggregate to" heading:

<figure>
  <img src="../img/upload-aggregation-area.png" />
  <figcaption>Uploading an aggregation area</figcaption>
</figure>

You can then name your aggregation area and select the files to upload. Be sure to select all components of the Shapefile (i.e. .shp, .dbf, .shx, .prj, etc.). It may take some time to upload the files and process them, depending on their size and complexity. If there are multiple polygons in the input file, they will be merged into a single aggregation area.

Once the aggregation area is uploaded, you can perform the aggregation. You will select the area you want to aggregate to, as well as what you want to weight by. For example, if you select "Workers total,"" your histogram will represent how many workers experience different levels of accessibility. If instead you select "Workers with earnings $1250 per month or less," you will see how accessibility is distributed among low income workers. Any opportunity dataset you have uploaded is available for use as weights.

Once you have an aggregation area and weight selected, you will see a display similar to the one below, showing a histogram of how many of the units you weighted by experience a particular level of access.

<figure>
  <img src="../img/aggregate-accessibility.png" />
  <figcaption>Aggregate accessibility in Brooklyn, New York, USA</figcaption>
</figure>

The plot is a histogram of the number jobs accessible within the full opportunity dataset (not just Brooklyn) for workers residing in Brooklyn (since this is a regional analysis of access to jobs, aggregated to Brooklyn, and weighted by workers). We can see that the distribution is bimodal. There are a large number of workers with relatively lower accessibility values (the left peak),  most likely residing in outer Brooklyn further from the subway and from job centers . There are also  a number of workers with a higher level of accessibility, probably those residing in downtown Brooklyn  and near Manhattan. This plot is conceptually similar to academic work on accessibility by population percentile (e.g. [Grengs et al. 2010](http://journals.sagepub.com/doi/10.1177/0739456X10363278)).

Below the histogram is a readout of the metric mentioned above: how many opportunities are accessible to a certain quantile of the population; in this case, 90% of workers residing in Brooklyn have access to more than 267,000 jobs. You can adjust the percentile by dragging the slider. The area of the histogram above the cutoff is highlighted. By setting it below 100%, you are effectively choosing what percentage
of your region it is not practical to serve with transit, and not penalizing transit accessibility metrics for the lack of access in those areas.

The last metric is the weighted mean accessibility. This is a popular metric, and one used by Conveyal in the past. This represents the average accessibility experienced by all residents (or whatever unit you have weighted by) in the aggregation area. However, since it uses the mean, it is strongly affected  by outliers, and is not representative of the full range of accessibility experienced. In the Brooklyn case, it falls between the two peaks, and does not reflect that many people have accessibility below that. Since aggregate accessibility frequently has a long right tail, with many residents with low to medium accessibility and few with very high accessibility, the mean is often higher than the accessibility experienced by a majority of the population. For these reasons, we do not recommend the use of this metric.
