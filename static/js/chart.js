// const dataAll_url = "http://127.0.0.1:5000/data_all";
const data2012_url = "https://thirsty2thrive.herokuapp.com/data_2012"

// API calling and fetching the data from one of the flask routes
d3.json(data2012_url).then(function(data) {
    // creating an array of income classes of countries
    let classes = [];
    let uniqueClasses;
    data.forEach(country => {
        Object.entries(country).forEach(key => {
            classes.push((key[1][2]));
        });
        uniqueClasses = [...new Set(classes)];
    });
    console.log(uniqueClasses);


    // Empty arrays for different income classes
    let highIncome = [],
    upperMiddleIncome = [],
    lowerMiddleIncome = [],
    lowIncome = [];



    // Creating arrays of data of each country which falls into specific socio-economic category
    data.forEach(country => {
        Object.entries(country).forEach(key => {
            if (key[1][2]=== "High income") {
                if (key[1][1]!= null) {
                    highIncome.push(key[1][1])};
            } else if (key[1][2]=== "Upper middle income") {
                if (key[1][1]!= null) {
                    upperMiddleIncome.push(key[1][1])}
            } else if (key[1][2]=== "Lower middle income") {
                if (key[1][1]!= null) {
                    lowerMiddleIncome.push(key[1][1])};
            } else if (key[1][2]=== "Low income") {
                if (key[1][1]!= null) {
                    lowIncome.push(key[1][1])};
            } else if (key[1][2]== null) {
                console.log("null")};
        });
    });

    // function to calculate average value
    function calcAverage(array) {
        let sum = 0;
        for (let i=0;i<array.length;i++){
            sum += array[i];             
        };
        avg = sum/array.length;
        return avg;
    };


    yData = [calcAverage(highIncome), calcAverage(upperMiddleIncome), calcAverage(lowerMiddleIncome), calcAverage(lowIncome)];
    xData = ["High income","Upper middle income","Lower middle income","Low income"]

    let graphData = [
        {
            x: xData,
            y: yData,
            type: "bar",
            marker: {
                color: '#43b1d9 '
            }
        }
    ];

    let layout = {
        title: 'Percentage of people using safely managed drinking water services in 2012',
        titlefont: { size:18 },
        font: {size: 11},
        hovermode:'closest',
        xaxis:{zeroline:false, title: 'countries by socio-economic category'},
        yaxis:{zeroline:false, hoverformat: '.2r', title: '% of population'}
    };

    Plotly.newPlot("income-class-chart", graphData, layout, {responsive: true});
});



