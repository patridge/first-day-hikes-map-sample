/***Let JSLint know what the expected global variables are***/
/*global $, document, clearTimeout, setTimeout, window, d3*/
var map = (function () {
  "use strict";

  var w = 960;
  var h = 500;
  var proj = d3.geo.albersUsa();
  var path = d3.geo.path().projection(proj);
  var currentState;

  // the variable that holds our translate, centers on the netherlands
  //var translate = proj.translate();
  //translate[0] = -500;
  //translate[1] = 10640

  // center on the netherlands and zoom all the way in
  //proj.translate(translate);
  //proj.scale(60000);
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

  d3.json("us-states-20m.json", function (mapJson) {
    d3.json("First_Day_Hikes_Report.json", function (hikesJson) {
      var hikes = hikesJson.First_Day_Hikes;
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
      us.selectAll("path")
        .data(mapJson.features)
        .enter().append("path")
        .attr("d", path)
        .classed("has-events", function (d) {
          return _.some(states, function (state) { return d.properties.NAME === state; });
        })
        .on("click", clicked);
      events.selectAll("li").data(hikes)
        .enter().append("li")
        .text(function (d) {
          return d.Park + " (" + d.State + ")";
        });
    });
  });
}());
