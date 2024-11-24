# First Day Hikes - D3.js proof-of-concept

This repo contains a sample proof-of-concept that was developed as a way to find and showcase [First Day Hikes](https://americanhiking.org/first-day-hikes/) as part of a collaboration with Wyoming State Parks and Cultural Resources.

[US States selection demo using D3.js](https://patridge.github.io/first-day-hikes-map-sample/) (running via GitHub Pages branch publish on this repo)
[US States selection demo using D3.js](https://gentle-mud-0168f271e.1.azurestaticapps.net/) (running in an Azure Static Web App built from this repo)

> NOTE: As a sample proof-of-concept, this code should probably not be used for a production system. But feel free to use it to help learn the concepts used.

## User story

Showing a map of the US states, allow filtering to first day hikes for a given state.

## Process

Mapping data is derived from [publicly available US Census mapping data](https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html). This geographic data is probably much more complicated than is necessary, coming in at approximately 1.4MB for the 1:20,000,000 scale (20m), but it serves as a good starting point for a sample demo.

From there, D3.js takes up most of the challenging work. [D3.js](https://d3js.org/) is a JavaScript library for data manipulation and visualization. In this case, the page uses a CDN version of the library made available from CloudFlare.

For HTML, there are a couple placeholders where we render the map any relevant hike events. After that, everything is handled in JavaScript.

Within the JavaScript, D3.js loads the US states JSON and hike event JSON and establishes events to connect those two points. As the original version worked, the process at a high level looked like this.

1. Gather up map data and hike data.
1. Find all the possible states that have hikes.
1. Add a CSS class to those states to highlight it as available.
1. Add a click handler for those states to handle selection.
1. Create a list of events, initially showing just with the park and state, with the rest of the event data attached to the list item.
1. Then, within the click handler when a state is selected, switch which state is active and highlighted via CSS class. Then filter the event list by that state stored in the event data.
