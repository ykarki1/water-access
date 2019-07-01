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
      atLeastBasic.push(element.atLeastBasic);
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
    title: "At least basic drinking water coverage",
    showlegend: true
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
            autocolorscale: true
          }
        ],
        layout: {
          title: "Access to Clean Water by Country",
          geo: {
            projection: {
              type: "Hammer"
            }
          },
          sliders: [
            {
              pad: { t: 30 },
              x: 0.2,
              len: 0.95,
              currentvalue: {
                xanchor: "right",
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






//! Spaar
//* These are the funcs that make the claim clickable, and reveals the "Verdict" about it .onclick()
//todo these should probably be refactored into just one case switcher or otherwise
//
function colorFill_0() {
  //clearColors("")
  d3.select("c-SV-0")
    .select("h6")
    .classed('bg-dark', false)
    //remove this after testing
    .classed('bg-info', true)
    .classed('border', true)
    .classed('border-light', true)
    .style('opacity', 1)
    .classed('py-4', true)
    .classed('px-5', true)
    .classed('text-light', false)
    .classed('text-white', true)
  //d3.select(".carousel-control-next-icon")
};
function colorFill_1() {
  //clearColors("")
  d3.select("c-SV-1")
    .select("h6")
    .classed('bg-dark', false)
    .classed('bg-danger', true)
    .classed('border', true)
    .classed('border-light', true)
    .style('opacity', 1)
    .classed('py-4', true)
    .classed('text-light', false)
    .classed('text-white', true)
  //d3.select(".carousel-control-next-icon")
};
function colorFill_2() {
  //clearColors("")
  d3.select("c-SV-2")
    .select("h6")
    .classed('bg-dark', false)
    .classed('bg-warning', true)
    .classed('border', true)
    .classed('border-light', true)
    .style('opacity', 1)
    .classed('py-4', true)
    .classed('text-light', false)
    .classed('text-white', true)
  //d3.select(".carousel-control-next-icon")
};
function colorFill_3() {
  //clearColors("")
  d3.select("c-SV-3")
    .select("h6")
    .classed('bg-dark', false)
    .classed('bg-success', true)
    .classed('border', true)
    .classed('border-light', true)
    .style('opacity', 1)
    .classed('py-4', true)
    .classed('text-light', false)
    .classed('text-white', true)
  //d3.select(".carousel-control-next-icon")
};
function colorFill_4() {
  //clearColors("")
  d3.select("c-SV-4")
    .select("h6")
    .classed('bg-dark', false)
    .classed('bg-success', true)
    .classed('border', true)
    .classed('border-light', true)
    .style('opacity', 1)
    .classed('py-4', true)
    .classed('text-light', false)
    .classed('text-white', true)
  //d3.select(".carousel-control-next-icon")
};
//






/*
//* Remove all of the .onlick CSS mods applied to "Verdicts"
function clearColors(SlideID) {
  d3.select(SlideID)
    .select("h6")
    .classed('bg-dark', true)
    .classed('bg-success', false)
    .classed('bg-warning', false)
    .classed('bg-danger', false)
    .classed('border', false)
    .classed('border-light', false)
    .style('display', 'none')
    .classed('py-4', false)
    .classed('text-light', true)
    .classed('text-white', false)
};
*/







//todo:::       1) Figure out the currently .active carousel-indicator ID

//todo:::       2) Match that to the corresponding carousel-SlideVerdict-ID, then... (case switcheroo?)

//todo:::       3) D3.classed('display', '___') for the appropriate carousel-SlideVerdict-ID, and all
//todo          others are set to display:none; ----- maybe make all display:none; then activate just the
//todo          one desired each event?








/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//! ///////////////////////////////////////////////////////////////////////////////////////////////////// !//
//!                                                                                                       !//
//!                                     Library of Failures: Claims                                       !//
//!                                                                                                       !//
//! ///////////////////////////////////////////////////////////////////////////////////////////////////// !//
//--------------------------------------------------------------------------------------------------------//
//!   Hopes:::     D3.js to return the slide ID if class in('.active').
//!   Result:::    It executes too fast and returns the wrong value (Slide previous to the .active).
//
//? If there are no other options, I'll go this route with a mega hacky arrowCase switcheroo to add
//? or subtract 1 to or from the slide's ID value. Would need to desable indicator functionality too.
//
//
//* This "time.sleep()" method did not work, it still executes one slide behind the desired slide.
//
//* Calling this as a .onchange() within the carousel-indicators did not execute when class was changed.
//
/*
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    };
  };
};

function one() {
  sleep(0);
};

function two() {
  let activeSlideObj = d3.select(".carousel-indicators").select(".active");
  return activeSlideObj
};

function three(activeSlideObj) {
  console.log("Active Carousel Slide ID: " + activeSlideObj._groups[0][0].attributes[2].nodeValue + "\n");
  alert("Active Carousel Slide ID: " + activeSlideObj._groups[0][0].attributes[2].nodeValue);
};

function verdictExecute() {
  one();
  var activeSlideObj = two();
  three(activeSlideObj);
};
*/
//--------------------------------------------------------------------------------------------------------//
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