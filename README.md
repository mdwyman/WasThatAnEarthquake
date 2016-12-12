# WasThatAnEarthquake

This repo contains the Javascript used in [WasThatAnEarthquake](https://wasthatanearthquake.net).  The purpose of the site is to determine if there was a perceptible earthquake in the last 15 minutes at the users location. There also a google map of the users location and all earthquakes of magnitude greater than 1.0 in the last 24 hours broken into three groups: "Last 15 minutes", "Last hour", "Last day".  Circles representing each earthquake have radii related to the magnitude of that particular event:

$$radius = 2^{magnitude-1}$$

## Magnitudes

An estimate of the magnitude at the users location for all earthquakes in the last 15 minutes is calculated using USGS's predicted distance attenuation (PDA) function.  The USGS provides PDA’s for the eastern and western U.S. both are calculated and used as upper and lower bounds, respectively.  

$$M_{eastern}\ =\ 1.60\ +1.29*M\ -\ 0.00051*L - 2.16*log_{10}L$$

$$M_{western}\ =\ 1.15\ +1.01*M\ -\ 0.00054*L - 1.72*log_{10}L$$

Where M is the measured magnitude of the earthquake and L the chordal distance between the user and the earthquake epicenter.  

## Chordal distances

The chordal distance is calculated:

$$L\ = \frac{R_earth}{1000.0}$$