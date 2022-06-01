/***Let JSLint know what the expected global variables are***/
/*global $, document, clearTimeout, setTimeout, window, d3*/
var map = (function () {
  "use strict";

  var w = 960;
  var h = 500;
  var proj = d3.geo.albersUsa();
  var path = d3.geo.path().projection(proj);
  var currentState;

  proj.translate(); // the projection's default translation
  proj.scale() // the projection's default scale

  var svg = d3.select("#map").append("svg")
    .attr("width", w)
    .attr("height", h);
  var us = svg
    .append("g")
    .attr("id", "us");
  var events = d3.select("#events");
  var clicked = function (d) {
    var stateName = null;
    if (d && currentState !== d) {
      currentState = d;
      stateName = d.properties.NAME;
    } else {
      currentState = null;
    }

    us.selectAll("path")
      .classed("active", currentState && function (d) {
        return d === currentState;
      });
    events.selectAll("li")
      .style("display", function (d) {
        return stateName === null || d.State === stateName ? "inherit" : "none";
      });
  }

  // Note: While fine for a proof-of-concept, this fairly complex Census-derived US states JSON geo data is probably way more complex than is necessary for this usage.
  d3.json("us-states-20m.json", function (mapJson) {
    d3.json("First_Day_Hikes_Report.json", function (hikesJson) {
      var hikes = hikesJson.First_Day_Hikes;
      // Get all the states that have hikes.
      var states = _.chain(hikes)
        .map(function (hike) {
          return hike.State;
        })
        .where(function (state) {
          return state !== null && state !== "";
        })
        .toArray()
        .uniq()
        .value();
      // Highlight states with hikes on the map via CSS and add click handler.
      us.selectAll("path")
        .data(mapJson.features)
        .enter().append("path")
        .attr("d", path)
        .classed("has-events", function (d) {
          return _.some(states, function (state) { return d.properties.NAME === state; });
        })
        .on("click", clicked);
      // Build up list of all hike events.
      events.selectAll("li").data(hikes)
        .enter().append("li")
        .text(function (d) {
          return d.Park + " (" + d.State + ")";
        });
    });
  });
}());
