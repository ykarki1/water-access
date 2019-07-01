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
// These are the funcs that make the claim clickable, and reveals its truthfullness .onclick()
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






function verdictExecute(arrowCase) {
  if ((arrowCase) && (arrowCase != "prev") || (arrowCase != "next")) {
    alert("[!] Received arrowCase was invalid: " + arrowCase);
    console.warn("[!] Received arrowCase was invalid" + arrowCase);
  } else {
    //? get the currently .active slide

    //? c
    // put the arrows' locs into variables
    // var arrowPrev = d3.select('.carousel-control-prev').select("#arrow-Prev");
    // var arrowNext = d3.select('.carousel-control-next').select("#arrow-Next");
    //* case switcher for the arrow received from the onclick
    switch (arrowCase) {
      case "prev":
        console.log("\nArrow Case: " + arrowCase + " [<< PREV] received: Displaying new verdict and hiding all others...\n");
        //!
        //
        //!
        break;
      case "next":
        console.log("\nArrow Case: " + arrowCase + " [NEXT >>] received: Displaying new verdict and hiding all others...\n");
        //!
        //!
        //!
        break;
    }
  }
}


/*
function clearVerdict(slideNumber) {
  var SlideToHide = slideNumber;
  switch (SlideToHide) {
    case 0:
      console.log("\nCase 0 received, hiding the first slide..\n")
      d3.select("#verdictRow0")
        .style('opacity', .00)
      break;
    case 3:
      console.log("\nCase 3 received, hiding the first slide..\n")
      d3.select("#verdictRow3")
        .style('opacity', .00)
      break;
  }
}
*/
    /////todo add ids to each carousel-inner
    //todo impliment a case switch for which id is then in the selection
    //todo each case will make the appropriate verdict clickers display .style changed
