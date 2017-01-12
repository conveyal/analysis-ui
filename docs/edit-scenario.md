# Editing transport scenarios

Transport scenarios in Scenario Editor are made up of a series of modifications of various types. When all the modifications
are strung together, they represent a new state of the transport system in a region. This page describes the available modification
types; each type also has an individual page describing the specifics of how to use it.

After uploading a bundle and creating a project, you will arrive at a screen that looks like this, which you use to edit the transport scenario:

<img src="/img/create-project.png" />

A transport scenario is made up of many modifications, each of which represents a single operation on the transit network (for example adding a line, or adjusting
the speed of an existing line). All modifications are listed in the left-hand bar. Each modification has an eye icon next to it, which controls whether it is currently
displayed on the map. Clicking on the title of a modification will open it and allow you to edit it. To create a new modification of a particular type,

Oftentimes, there will be several scenarios that are very similar, differing only in a few minor aspects. In particular, one scenario is often
a superset of another (for instance, there is a base scenario which involves building six new rail lines, and another scenario which additionally
involves building four more). Instead of having to code each scenario separately, we support the concept of scenario variants. You can create variants
by clicking the "Create" button under "Variants," and entering a name for each variant. The buttons to the right of a variant name allow, respectively, exporting the
variant to Transport Analyst, viewing a printer-friendly summary of the modifications in the variant, and showing the variant on the map.

<img src="/img/variant-editor.png" />

Within each modification you can then choose which variants it is active in:

<img src="/img/variant-chooser.png" />

## Available modification types

- [Add trips](/modifications/add-trip-patterns)
- [Remove trips](/modifications/remove-trips)
- [Remove stops](/modifications/remove-stops)
- [Adjust speed](/modifications/adjust-speed)
- [Adjust dwell time](/modifications/adjust-dwell-time)
- [Adjust frequency](/modifications/adjust-frequency)
- [Reroute](/modifications/reroute)
