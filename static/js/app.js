AOS.init();

// Create the country dropdown menu
var countrySelector = d3.select("#selCountry");

function countries() {
  var countries = data.map(data => data.entity).sort();
  var uniqueCountries = [...new Set(countries)];
  uniqueCountries.forEach(element => {
    var row = countrySelector.append("option");
    row.text(element);
  });
};

function filterPlot() {
  var selectedCountry = countrySelector.property("value");
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

  var atLeastBasic = {
    x: x,
    y: atLeastBasic,
    name: "At Least Basic",
    type: "bar"
  };

  var limited = {
    x: x,
    y: limited,
    name: "Limited",
    type: "bar"
  };

  var unimproved = {
    x: x,
    y: unimproved,
    name: "Unimproved",
    type: "bar"
  };

  var surfaceWater = {
    x: x,
    y: surfaceWater,
    name: "Surface Water",
    type: "bar"
  };
  var data = [atLeastBasic, limited, unimproved, surfaceWater];

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

  Plotly.newPlot("myDiv", data, layout);
};
// run filterPlot with 'world' as the selectedCountry to produce the initial bar chart
countries();
filterPlot();

var filterbtn = d3.select("#filter-btn");
filterbtn.on("click", filterPlot);
