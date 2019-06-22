AOS.init();

var countrySelector = d3.select("#selCountry");
// Create the country dropdown menu
function countries() {
    var countries = data.map(data => data.Entity).sort()
    console.log(countries)
    var uniqueCountries = [...new Set(countries)]
    uniqueCountries.forEach(element => {
        var row = countrySelector.append("option");
        row.text(element)
    });
}
countries()

