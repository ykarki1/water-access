AOS.init();

// Create the country dropdown menu
var countrySelector = d3.select("#selCountry");
var countrySelector2 = d3.select("#selCountry2");
function countries() {
  var countries = data.map(data => data.entity).sort();
  var uniqueCountries = [...new Set(countries)];
  uniqueCountries.forEach(element => {
    var row = countrySelector.append("option");
    var row2 = countrySelector2.append("option");
    row.text(element);
    row2.text(element);
  });
}
// Create the year dropdown menu
var yearSelector = d3.select("#yearSelector");
function createYears() {
  var year = data.map(data => data.year).sort();
  var uniqueYear = [...new Set(year)];
  uniqueYear.forEach(element => {
    var row = yearSelector.append("option");
    row.text(element);
  });
  return uniqueYear;
}

function filterPlot(div, selector) {
  var selectedCountry = selector.property("value");
  var countryData = window.data.filter(
    data => data.entity == `${selectedCountry}`
  );
  var atLeastBasic = [];
  var limited = [];
  var unimproved = [];
  var surfaceWater = [];
  var x = [];
  countryData.forEach(element => {
    atLeastBasic.push(element.atLeastBasic);
    limited.push(element.limited);
    unimproved.push(element.unimproved);
    surfaceWater.push(element.surfaceWater);
    x.push(element.year);
  });

  var atLeastBasicTrace = {
    x: x,
    y: atLeastBasic,
    name: "At Least Basic",
    type: "bar"
  };

  var limitedTrace = {
    x: x,
    y: limited,
    name: "Limited",
    type: "bar"
  };

  var unimprovedTrace = {
    x: x,
    y: unimproved,
    name: "Unimproved",
    type: "bar"
  };

  var surfaceWaterTrace = {
    x: x,
    y: surfaceWater,
    name: "Surface Water",
    type: "bar"
  };
  var data = [
    atLeastBasicTrace,
    limitedTrace,
    unimprovedTrace,
    surfaceWaterTrace
  ];

  var layout = {
    title: {
      text: `${selectedCountry}`,
      font: {
        family: "Courier New, monospace",
        size: 24
      },
      xref: "paper",
      x: 0.05
    },
    xaxis: {
      title: {
        text: "Year",
        font: {
          family: "Courier New, monospace",
          size: 18,
          color: "#7f7f7f"
        }
      }
    },
    yaxis: {
      title: {
        text: "Drinking Water Service Coverage",
        font: {
          family: "Courier New, monospace",
          size: 18,
          color: "#7f7f7f"
        }
      }
    },
    barmode: "stack"
  };

  Plotly.newPlot(div, data, layout, { responsive: true });
  line();
}

countries();
filterPlot("myDiv", countrySelector);
filterPlot("myDiv2", countrySelector2);
allYears = createYears();
year();

function line() {
  var traces = [];
  var countries = [
    countrySelector.property("value"),
    countrySelector2.property("value")
  ];
  countries.forEach(country => {
    var countryData = window.data.filter(data => data.entity == `${country}`);
    var atLeastBasic = [];
    var x = [];
    countryData.forEach(element => {
      atLeastBasic.push(element.atLeastBasic/(element.limited + element.surfaceWater + element.unimproved + element.atLeastBasic));
      x.push(element.year);
    });
    var trace = {
      x: x,
      y: atLeastBasic,
      type: "scatter",
      name: `${country}`
    };
    traces.push(trace);
  });

  var layout1 = {
    title: "Percentage of Population With At Least Basic Drinking Water Coverage",
    showlegend: true,
    yaxis:{
      autorange: true,
      tickformat: ',.0%',
      hoverformat: ',.2%',
      range: [0,1]
    }
  };

  Plotly.newPlot("line", traces, layout1, { responsive: true });
}

var steps = [];
for (let i = 0; i < allYears.length; i++) {
  const element = allYears[i];
  var step = {
    label: element,
    method: "animate",
    args: [
      [element],
      {
        mode: "immediate",
        frame: { redraw: true, duration: 500 },
        transition: { duration: 500 }
      }
    ]
  };
  steps.push(step);
}

function year() {
  Plotly.d3.csv(
    "https://raw.githubusercontent.com/ykarki1/water-access/master/water_data.csv",
    function(err, rows) {
      function unpack(rows, key) {
        return rows.map(function(row) {
          return row[key];
        });
      }
      var frames = [];
      for (let i = 0; i < allYears.length; i++) {
        const element = allYears[i];
        var frame = {
          name: element,
          data: [
            {
              z: unpack(rows, element)
            }
          ]
        };
        frames.push(frame);
      }

      Plotly.plot("choropleth", {
        data: [
          {
            type: "choropleth",
            locationmode: "Country Name",
            locations: unpack(rows, "Country Code"),
            z: unpack(rows, 2000),
            text: unpack(rows, "Country Code"),
                      colorscale: [
              [0, 'rgb(129, 25, 24)'], [0.2, 'rgb(227, 104, 103)'],
              [0.4, 'rgb(248, 219, 219)'], [0.6, 'rgb(196, 196, 255)'],
              [0.8, 'rgb(120, 120, 255)'], [1, 'rgb(0, 0, 157)']
          ],
          }
        ],
        layout: {
          title: "Access to Clean Water by Country",
          geo: {
            projection: {
              type: "robinson"
            }
          },
          sliders: [
            {
              pad: { t: 30 },
              x: 0.2,
              len: 0.95,
              currentvalue: {
                xanchor: "center",
                prefix: "Year: ",
                font: {
                  color: "#888",
                  size: 20
                }
              },
              transition: { duration: 0 },
              // By default, animate commands are bound to the most recently animated frame:
              steps: steps
            }
          ],
          updatemenus: [{
            type: 'buttons',
            showactive: false,
            x: 0.3,
            y: 0.3,
            xanchor: 'right',
            yanchor: 'top',
            direction: 'left',
            pad: {t: 60, r: 20},
            buttons: [{
              label: 'Play',
              method: 'animate',
              args: [null, {
                fromcurrent: true,
                frame: {redraw: true, duration: 1000},
                transition: {duration: 500}
              }]
            }, {
              label: 'Pause',
              method: 'animate',
              args: [[null], {
                mode: 'immediate',
                frame: {redraw: true, duration: 0}
              }]
            }]
          }]
        },
        // The slider itself does not contain any notion of timing, so animating a slider
        // must be accomplished through a sequence of frames. Here we'll change the color
        // and the data of a single trace:
        frames: frames
      });
    }
  );
}
// run filterPlot with 'world' as the selectedCountry to produce the initial bar chart
//
//
//
//
//
//! Spaar
//* These are the funcs that make the claim clickable, and reveals the "Verdict" about it .onclick()
//todo these should probably be refactored into just one case switcher or otherwise
//
function colorFill_0() {
  clearColors("#c-SV-x")
  clearColors("#c-SV-1")
  //killVerdictDisplays();
  d3.select("#c-SV-0-Parent")
    .classed('border-secondary', false)
    .classed('border-info', true)
    .select("#c-SV-0")
    .select("h6")
    .style('opacity', 1)
    .classed('text-light', false)
    .classed('text-info', true)
};
function colorFill_1() {
  clearColors("#c-SV-2")
  clearColors("#c-SV-0")
  //killVerdictDisplays();
  d3.select("#c-SV-1-Parent")
    .classed('border-secondary', false)
    .classed('border-danger', true)
    .select("#c-SV-1")
    .select("h6")
    .style('opacity', 1)
    .classed('text-light', false)
    .classed('text-danger', true)
};
function colorFill_2() {
  clearColors("#c-SV-3")
  clearColors("#c-SV-1")
  //killVerdictDisplays();
  d3.select("#c-SV-2-Parent")
    .classed('border-secondary', false)
    .classed('border-warning', true)
    .select("#c-SV-2")
    .select("h6")
    .style('opacity', 1)
    .classed('text-light', false)
    .classed('text-warning', true)
};
function colorFill_3() {
  clearColors("#c-SV-4")
  clearColors("#c-SV-2")
  //killVerdictDisplays();
  d3.select("#c-SV-3-Parent")
    .classed('border-secondary', false)
    .classed('border-success', true)
    .select("#c-SV-3")
    .select("h6")
    .style('opacity', 1)
    .classed('text-light', false)
    .classed('text-success', true)
};
function colorFill_4() {
  clearColors("#c-SV-x")
  clearColors("#c-SV-3")
  //killVerdictDisplays();
  d3.select("#c-SV-4-Parent")
    .classed('border-secondary', false)
    .classed('border-success', true)
    .select("#c-SV-4")
    .select("h6")
    .style('opacity', 1)
    .classed('text-light', false)
    .classed('text-success', true)
};
//
function colorFill_x() {
  clearColors("#c-SV-4")
  clearColors("#c-SV-0")
  killVerdictDisplays_notX();
  d3.select("#c-SV-x-Parent")
    .classed('border-secondary', false)
    .classed('border-info', true)
    .select("#c-SV-x")
    .select("h6")
    .style('opacity', 1)
    .classed('text-light', false)
    .classed('text-info', true)
};
//
//* Remove all of CSS formatting applied to "Verdicts"
function clearColors(SlideID) {
  d3.select(SlideID + "-Parent")
    // Parent level
    .classed('border-secondary', true)
    .classed('border-info', false)
    .classed('border-danger', false)
    .classed('border-warning', false)
    .classed('border-success', false)
    // Child level
    .select(SlideID)
    .select("h6")
    .style('opacity', .70)
    .classed('text-light', true)
    .classed('text-info', false)
    .classed('text-danger', false)
    .classed('text-warning', false)
    .classed('text-success', false)
};
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//! ///////////////////////////////////////////////////////////////////////////////////////////////////// !//
//!                                                                                                       !//
//!                                  Spaar's Abhorrent JS: Claims.html                                    !//
//!                                                                                                       !//
//! ///////////////////////////////////////////////////////////////////////////////////////////////////// !//
//--------------------------------------------------------------------------------------------------------//
//
//
function getPreviousObject() {
  let previousSlideObj = d3.select(".carousel-indicators").select(".active");
  return previousSlideObj
};
//
function debuggingWhatnot(activeSlideObj) {
  console.log("Active Carousel Slide ID: " + activeSlideObj._groups[0][0].attributes[2].nodeValue + "\n");
};
//
function killVerdictDisplays() {
  d3.select("#carousel-SlideVerdict-0")
    .style('display', 'none');
  d3.select("#carousel-SlideVerdict-1")
    .style('display', 'none');
  d3.select("#carousel-SlideVerdict-2")
    .style('display', 'none');
  d3.select("#carousel-SlideVerdict-3")
    .style('display', 'none');
  d3.select("#carousel-SlideVerdict-4")
    .style('display', 'none');
  d3.select("#carousel-SlideVerdict-x")
    .style('display', 'none');
};
//
function killVerdictDisplays_notX() {
  d3.select("#carousel-SlideVerdict-0")
    .style('display', 'none');
  d3.select("#carousel-SlideVerdict-1")
    .style('display', 'none');
  d3.select("#carousel-SlideVerdict-2")
    .style('display', 'none');
  d3.select("#carousel-SlideVerdict-3")
    .style('display', 'none');
  d3.select("#carousel-SlideVerdict-4")
    .style('display', 'none');
};
//
//
//
//todo    better comments, change vars to lets || change vars to consts where possible
//*    verdictExecute(arrow) parses/loads/etc the correct Verdict
function verdictExecute(arrow) {
  killVerdictDisplays();
  // turn the import into global var called arrowCase/
  var arrowCase = arrow;
  // if arrowCase is a bad cast, shit the bed
  if (arrowCase === null) {
    alert("[!] Received arrowCase was null: '" + arrowCase + "'");
    console.error("\n[!] Received arrowCase was invalid: " + arrowCase + "\n");
  } else {
    // d3 selects what /it/ thinks is the currently .active slide object
    var previousSlideObj = getPreviousObject();
    // dig down way deep to get dat nodeValue and return it as an int
    var slideIndex = parseInt(previousSlideObj._groups[0][0].attributes[2].nodeValue);
    // if we're on the 0th slide, don't do any math on it like we do in the switcheroo
    //! this is buggy af
    if (slideIndex === 0) {
      var slideID = parseInt(slideIndex);
      console.log("\nThe slideIndex reads as '0'\n")
    } else {
      // case switcheroo depending on the arrowCase (which direction the user is navigating the slides)
      // the only difference is if we are adding or subtracting from the slideIndex that d3 gives us since
      // I can't figure out how to lag it to read the correct and current slide's value over the previous.
      switch (arrowCase) {
        // for "Prev" (navigating backwards on the carousel slides)
        case 'prev':
          console.log("\nAccepted arrowCase of: '" + arrowCase + "' received...\n");
          console.log("\nLength of arrowCase: '" + arrowCase.length + "'...\n");
          console.log("\n'[<< PREV]' subtracting 1 from the slideBase...\n\n\n\n-----------------------------------\n\n\n");
          // subtract 1 to from Index and make that the slideID global var
          var slideID = parseInt(slideIndex - 1);
          console.log("\nActive slideID: '" + slideID + "'\n");
          // ensure all Verdicts are hidden in their absolute positions
          killVerdictDisplays();
          // assign a formatted string to a var using the target's ID and our current slideID
          var activeVerdictID = ("#" + "carousel-SlideVerdict-" + slideID)
          // select it with d3 then revert the display to an unset/default value
          d3.select(activeVerdictID).style('display', 'unset');
          break;
        // for "Next" (navigating forwardss on the carousel slides)
        case 'next':
          console.log("\nAccepted arrowCase of: '" + arrowCase + "' received...\n");
          console.log("\nLength of arrowCase: '" + arrowCase.length + "'...\n");
          console.log("\n'[NEXT >>]' adding 1 to the slideBase...\n\n\n\n-----------------------------------\n\n\n");
          // add 1 to the Index and make that the slideID global var
          var slideID = parseInt(slideIndex + 1);
          console.log("\nActive slideID: '" + slideID + "'\n");
          // ensure all Verdicts are hidden in their absolute positions
          killVerdictDisplays();
          // assign a formatted string to a var using the target's ID and our current slideID
          var activeVerdictID = ("#" + "carousel-SlideVerdict-" + slideID)
          // select it with d3 then revert the display to an unset/default value
          d3.select(activeVerdictID).style('display', 'unset')
          break;
      };
    };
  };
};
//
//
//--------------------------------------------------------------------------------------------------------//
//!!!!!!!!!!!!!!!    Below doesn't work but I am keeping it for now for reference    !!!!!!!!!!!!!!!!!
//
//
//
//--------------------------------------------------------------------------------------------------------//
//!   Hopes:::     Custom event listeners will watch and report on any class changes from null to
//!                ".active". Processes for rendering the "Verdicts" could then be built out.
//!   Result:::    I am not really sure where the hang up is yet after a large amount of debugging...
//
/*
//* Function creation for newly, custom created listeners/handlers' implimentation.
// The ID of the element to be watches, as well as the desired call back are passed in to create the new listener. The interval is set to every 10ms, and each time the element is checked for my defined states of class being either being null or active. If a change between those 2 states is detected, the callback is invoked.
function addClassNameListener(elemId, callback) {
    var elem = document.getElementById(elemId);
    var lastClassName = elem.className;
    window.setInterval( function() {
       var className = elem.className;
        if (className !== lastClassName) {
            callback();
            lastClassName = className;
        }
    },10);
};
//
//* Creations for onclick listener/handler of element ID: "arrow-Prev"
// Declarations and inits of event listeners of class changes (specifically the addition or removal of the "active" class which is manipulated by the carousel to indicate which slide is currently active/shown to the user).
//
//*     Slides[0]
//
document.getElementById("arrow-Prev").onclick = function () {
  document.getElementById("carousel-IndicatorID-0").className = "active";
};
document.getElementById("arrow-Prev").onclick = function () {
  document.getElementById("carousel-IndicatorID-0").className = "";
};
addClassNameListener("carousel-IndicatorID-0", function () { alert("changed"); });
//
//
//*     Slides[1]
//
document.getElementById("arrow-Prev").onclick = function () {
  document.getElementById("carousel-IndicatorID-1").className = "active";
};
document.getElementById("arrow-Prev").onclick = function () {
  document.getElementById("carousel-IndicatorID-1").className = "";
};
addClassNameListener("carousel-IndicatorID-1", function () { alert("changed"); });
//
//
//*     Slides[2]
//
document.getElementById("arrow-Prev").onclick = function () {
  document.getElementById("carousel-IndicatorID-2").className = "active";
};
document.getElementById("arrow-Prev").onclick = function () {
  document.getElementById("carousel-IndicatorID-2").className = "";
};
addClassNameListener("carousel-IndicatorID-2", function () { alert("changed"); });
//
//
//*     Slides[3]
//
document.getElementById("arrow-Prev").onclick = function () {
  document.getElementById("carousel-IndicatorID-3").className = "active";
};
document.getElementById("arrow-Prev").onclick = function () {
  document.getElementById("carousel-IndicatorID-3").className = "";
};
addClassNameListener("carousel-IndicatorID-3", function () { alert("changed"); });
//
//
//*     Slides[4]
//
document.getElementById("arrow-Prev").onclick = function () {
  document.getElementById("carousel-IndicatorID-4").className = "active";
};
document.getElementById("arrow-Prev").onclick = function () {
  document.getElementById("carousel-IndicatorID-4").className = "";
};
addClassNameListener("carousel-IndicatorID-4", function () { alert("changed"); });
//
//
//* Creations for onclick listener/handler of element ID: "arrow-Next"
// Declarations and inits of event listeners of class changes (specifically the addition or removal of the "active" class which is manipulated by the carousel to indicate which slide is currently active/shown to the user).
//
//*     Slides[0]
//
document.getElementById("arrow-Next").onclick = function () {
  document.getElementById("carousel-IndicatorID-0").className = "active";
};
document.getElementById("arrow-Next").onclick = function () {
  document.getElementById("carousel-IndicatorID-0").className = "";
};
addClassNameListener("carousel-IndicatorID-0", function () { alert("changed"); });
//
//
//*     Slides[1]
//
document.getElementById("arrow-Next").onclick = function () {
  document.getElementById("carousel-IndicatorID-1").className = "active";
};
document.getElementById("arrow-Next").onclick = function () {
  document.getElementById("carousel-IndicatorID-1").className = "";
};
addClassNameListener("carousel-IndicatorID-1", function () { alert("changed"); });
//
//
//*     Slides[2]
//
document.getElementById("arrow-Next").onclick = function () {
  document.getElementById("carousel-IndicatorID-2").className = "active";
};
document.getElementById("arrow-Next").onclick = function () {
  document.getElementById("carousel-IndicatorID-2").className = "";
};
addClassNameListener("carousel-IndicatorID-2", function () { alert("changed"); });
//
//
//*     Slides[3]
//
document.getElementById("arrow-Next").onclick = function () {
  document.getElementById("carousel-IndicatorID-3").className = "active";
};
document.getElementById("arrow-Next").onclick = function () {
  document.getElementById("carousel-IndicatorID-3").className = "";
};
addClassNameListener("carousel-IndicatorID-3", function () { alert("changed"); });
//
//
//*     Slides[4]
//
document.getElementById("arrow-Next").onclick = function () {
  document.getElementById("carousel-IndicatorID-4").className = "active";
};
document.getElementById("arrow-Next").onclick = function () {
  document.getElementById("carousel-IndicatorID-4").className = "";
};
addClassNameListener("carousel-IndicatorID-4", function () { alert("changed"); });
//
*/
//--------------------------------------------------------------------------------------------------------//