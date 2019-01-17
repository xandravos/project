/*
Name: Xandra Vos
Studentnumber: 10731148
*/

window.onload = function() {

    // requests both queries and waits till all requests are fulfilled
    var jsonEurope = "https://raw.githubusercontent.com/xandravos/project/master/code/europe.json"
    var data = "https://raw.githubusercontent.com/xandravos/project/master/code/data.json"

    var requests = [d3.json(jsonEurope), d3.json(data)];
    var format = d3.format(",");

    // executes a function
    Promise.all(requests).then(function(response) {
        var allData = prepareDataLine(response);
        var linechartList = allData[0];
        var years = allData[1];
        var countries = response[0];

        makeMap(countries)

        makeLineChart(linechartList, years)

        // makeDonutChart(year, country)

}).catch(function(e){
    throw(e);
});
};

function makeLineChart(data, years) {

    console.log(data)

    var margin = {top: 50, right: 50, bottom: 50, left: 50}
    var width = 700 - margin.left - margin.right
    var height = 400 - margin.top - margin.bottom;

    var minValue = d3.min(data)
    var maxValue = d3.max(data)
    var minYear = d3.min(years)
    var maxYear = d3.max(years)

    var xScale = d3.scaleLinear()
                   .domain([minYear, maxYear])
                   .range([0, width]);

    var yScale = d3.scaleLinear()
                   .domain([minValue, maxValue])
                   .range([height, 0]);

    var line = d3.line()
                 .x(function(d, i) {
                     console.log(d)
                     console.log(years[i])
                     return xScale(years[i])})
                 .y(function(d) { return yScale(d)});
    //
    // xScale.domain(d3.extent(years, function(d) { return +d}));
    // yScale.domain(d3.extent(data, function(d) { return +d }));

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
// var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })

var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format(""))); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// 9. Append the path, bind the data, and call the line generator
svg.append("path")
    .datum(data) // 10. Binds data to the line
    .attr("class", "line") // Assign a class for styling
    .attr("d", line); // 11. Calls the line generator

// 12. Appends a circle for each datapoint
// svg.selectAll(".dot")
//     .data(data)
//   .enter().append("circle") // Uses the enter().append() method
//     .attr("class", "dot") // Assign a class for styling
//     .attr("cx", function(d, i) { return xScale(i) })
//     .attr("cy", function(d) { return yScale(d.y) })
//     .attr("r", 5)
//       .on("mouseover", function(a, b, c) {
//   			console.log(a)
//         this.attr('class', 'focus')
// 		})
//       .on("mouseout", function() {  })
}

function prepareDataLine(data) {
    var country = "Belgium";
    var dataEn = data[1];
    var countries = data[0];

    var years = Object.keys(dataEn);
    var countriesData = Object.values(dataEn);

    linechartList = []
    countriesData.forEach(function(d, i) {
        valueTot = d[country]["Share of renewable energy in gross final energy consumption"]

        valueTot.replace(",", ".")
        console.log(d[country]["Share of renewable energy in gross final energy consumption"])
        linechartList.push(d[country]["Share of renewable energy in gross final energy consumption"])
    });

    return [linechartList, years];

}

function makeDonutChart() {

}

function makeMap(countries) {
    // Set tooltips
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.NAME + "<br></span>" + "<strong>Population: </strong><span class='details'></span>";
                })

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 500 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

    var color = d3.scaleThreshold()
        .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
        .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

    var path = d3.geoPath();

    var svg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append('g')
                .attr('id', 'worldmap');

    var projection = d3.geoMercator()
                       .scale(440)
                      .translate( [width / 2 - 60, height + 300 / 1]);

    var path = d3.geoPath().projection(projection);

    svg.call(tip);

    ready(countries, path, tip)
}

function ready(data, path, tip) {

    var eu = topojson.feature(data, data.objects.europe).features

    svg = d3.selectAll("#worldmap")
    svg.append("g")
          .attr("class", "countries")
        .selectAll("path")
          .data(eu)
        .enter().append("path")
          .attr("d", path)
          .style('stroke', 'white')
          .style('stroke-width', 1.5)
          .style("opacity",0.8)
          // tooltips
            .style("stroke","white")
            .style('stroke-width', 0.3)
            .on('mouseover',function(d){
              tip.show(d);

              d3.select(this)
                .style("opacity", 1)
                .style("stroke","white")
                .style("stroke-width",3);
            })
            .on('mouseout', function(d){
              tip.hide(d);

              d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","white")
                .style("stroke-width",0.3);
            })
            // .on("click", function(d, i) {
            //     makePie(menWomen[i])
            //     makeLineChart()
            // });
      //
      // svg.append("path")
      //     .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
      //      .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      //     .attr("class", "names")
      //     .attr("d", path);
    }
