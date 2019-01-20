/*
Name: Xandra Vos
Studentnumber: 10731148
*/

var country = "Belgium"
var marginMap = {top: 0, right: 0, bottom: 0, left: 0}
var widthMap = 500 - marginMap.left - marginMap.right
var heightMap = 500 - marginMap.top - marginMap.bottom;

var marginLine = {top: 50, right: 50, bottom: 50, left: 50};
var widthLine = 700 - marginLine.left - marginLine.right;
var heightLine = 400 - marginLine.top - marginLine.bottom;

window.onload = function() {

    // requests both queries and waits till all requests are fulfilled
    var jsonEurope = "https://raw.githubusercontent.com/xandravos/project/master/code/europe.json"
    var data = "https://raw.githubusercontent.com/xandravos/project/master/code/data.json"

    var requests = [d3.json(jsonEurope), d3.json(data)];
    var format = d3.format(",");

    // executes a function
    Promise.all(requests).then(function(response) {
        var jsonEurope = response[0];
        var dataJSON = response[1];

        var lineData = prepareDataLine(dataJSON, country);
        var linechartList = lineData[0];
        var years = lineData[1];

        makeMap(jsonEurope, dataJSON);

        // makeDropdown(countries)

        makeLineChart(linechartList, years);

        // makeDonutChart(year, country)

}).catch(function(e){
    throw(e);
});
};

function updateLine(linechartList, years) {

    var minValue = d3.min(linechartList);
    var maxValue = d3.max(linechartList);
    var minYear = d3.min(years);
    var maxYear = d3.max(years);

    var xScale = d3.scaleLinear()
                   .domain([minYear, maxYear])
                   .range([0, widthLine]);

    var yScale = d3.scaleLinear()
                   .domain([0, 100])
                   .range([heightLine, 50]);

    var line = d3.line()
                 .x(function(d, i) {
                     return xScale(years[i])
                 })
                 .y(function(d) {
                     return yScale(d)
                 });

    var newLine = d3.select(".linegraph").datum(linechartList);
    newLine.transition()
        .duration(250)
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "black");

    var newDots = d3.selectAll(".dot").data(linechartList);
    newDots.transition()
           .duration(250)
           .attr("d", line)
           .attr("cx", function(d, i) { return xScale(years[i]) })
           .attr("cy", function(d) { return yScale(d) })
           .attr("r", 5)
           .attr("fill", "#FFA500")

}

function makeLineSVG() {
    var svg = d3.select("#lineGraph")
                .append("svg")
                .attr("width", widthLine + marginLine.left + marginLine.right)
                .attr("height", heightLine + marginLine.top + marginLine.bottom)
                .append("g")
                .attr("transform", "translate(" + marginLine.left + "," + marginLine.top + ")");

    return svg;
}

function makeMapSVG() {

    var svg = d3.select("#map")
                .append("svg")
                .attr("width", widthMap)
                .attr("height", heightMap)
                .append("g")
                .attr("id", "worldmap");

    return svg;
};

function makeLineChart(data, years) {

    var heightSVG = 400;
    var widthSVG = 700;

    var minValue = d3.min(data);
    var maxValue = d3.max(data);
    var minYear = d3.min(years);
    var maxYear = d3.max(years);

    var svg = makeLineSVG();

    var xScale = d3.scaleLinear()
                   .domain([minYear, maxYear])
                   .range([0, widthLine]);

    var yScale = d3.scaleLinear()
                   .domain([0, 100])
                   .range([heightLine, 50]);

    var line = d3.line()
                 .x(function(d, i) {
                     return xScale(years[i])
                 })
                 .y(function(d) {
                     return yScale(d)
                 });

    // Call the x axis
    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + heightLine + ")")
       .call(d3.axisBottom(xScale).tickFormat(d3.format("")));

    // Call the y axis
    svg.append("g")
       .attr("class", "y axis")
       .call(d3.axisLeft(yScale));

    // Append the path, bind the data, and call the line generator
    svg.append("path")
       .datum(data)
       .attr("class", "linegraph")
       .attr("d", line)
       .style("fill", "none")
       .style("stroke", "black");

    // Appends a circle for each datapoint
    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("class", "dot")
       .attr("cx", function(d, i) { return xScale(years[i]) })
       .attr("cy", function(d) { return yScale(d) })
       .attr("r", 5)
       .on("mouseover", function(a, b, c) {
  			// console.log(a)
            // console.log(b)
            // console.log(c)
            return "<strong>Country: </strong><span class='details'>" + "Belgium" + "<br></span>" + "<strong>Percentage:" + b + "</strong><span class='details'></span>";
    	})
        .on("mouseout", function() {  })
}

function prepareDataLine(data, country) {
    var dataEn = data;
    var years = Object.keys(dataEn);
    var countriesData = Object.values(dataEn);

    linechartList = []
    countriesData.forEach(function(d, i) {
        linechartList.push(d[country]["Share of renewable energy in gross final energy consumption"])
    });

    return [linechartList, years];
}

function makeDonutChart() {

}

function makeMap(countries, dataJSON) {
    // Set tooltips
    var tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 0])
                .html(function(d) {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.NAME + "<br></span>" + "<strong>Share of renewable energy: </strong><span class='details'>" + " %" + "</span>";
                })


    var svg = makeMapSVG();

    var color = d3.scaleThreshold()
        .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
        .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

    var path = d3.geoPath();

    var projection = d3.geoMercator()
                       .scale(430)
                       .translate( [widthMap / 2 - 60, heightMap + 270]);

    var path = d3.geoPath().projection(projection);

    svg.call(tip);

    ready(countries, path, tip, dataJSON)
}

function ready(data, path, tip, dataJSON) {

    var eu = topojson.feature(data, data.objects.europe).features

    svg = d3.selectAll("#worldmap")
    svg.append("g")
       .attr("class", "countries")
       .selectAll("path")
       .data(eu)
       .enter().append("path")
       .attr("d", path)
       .style("stroke", "white")
       .style("stroke-width", 1.5)
       .style("opacity",0.8)
       // tooltips
       .style("stroke","white")
       .style("stroke-width", 0.3)
       // .style("fill", function(d){
       //   if (d.properties.NAME !=   )
       // })
       .on("mouseover",function(d){
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
        .on("click", function(d, i) {
            console.log(d.properties.NAME)
            var allData = prepareDataLine(dataJSON, d.properties.NAME)
            var linechartList = allData[0]
            var years = allData[1]
            // makeLineChart(linechartList, years)
            updateLine(linechartList, years)
        });

      // svg.append("path")
      //     .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
      //      .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      //     .attr("class", "names")
      //     .attr("d", path);
    }
