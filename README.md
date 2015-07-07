# WasThatAnEarthquake

This repo contains the Javascript used in [WasThatAnEarthquake][WasThatAnEarthquake.net].  The purpose of the site is to determine if there was a perceptible earthquake in the last 15 minutes at the users location. There also a google map of the users location and all earthquakes of magnitude greater than 1.0 in the last 24 hours broken into three groups: "Last 15 minutes", "Last hour", "Last day".  Circles representing each earthquake have radii related to the magnitude of that particular event:

radius = 2^(magnitude-1)

An estimate of the magnitude at the users location for all earthquakes in the last 15 minutes is calculated using...

