/*
Name: Xandra Vos
Studentnumber: 10731148
*/

var marginMap = {top: 0, right: 0, bottom: 0, left: 0}
var widthMap = 500 - marginMap.left - marginMap.right
var heightMap = 500 - marginMap.top - marginMap.bottom;

var marginLine = {top: 50, right: 50, bottom: 50, left: 50};
var widthLine = window.innerWidth - marginLine.left - marginLine.right - 200;
var heightLine = window.innerHeight - marginLine.top - marginLine.bottom - 100;

var minValue = 0;
var maxValue = 100;
var minYear = 2007;
var maxYear = 2016;

var xScale = d3.scaleLinear()
               .domain([minYear, maxYear])
               .range([0, widthLine]);

var yScale = d3.scaleLinear()
               .domain([minValue, maxValue])
               .range([heightLine, marginLine.top]);

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

        var country = "European Union (current composition)"

        var lineData = prepareDataLine(dataJSON, country);
        var linechartList = lineData[0];
        var years = lineData[1];

        makeMap(jsonEurope, dataJSON, years);

        // makeDropdown(countries)

        makeLineChart(linechartList, years);

        dropDown(dataJSON)

        // makeDonutChart(year, country)

}).catch(function(e){
    throw(e);
});
};

function makeSlider() {
// Time
  var dataTime = d3.range(0, 10).map(function(d) {
    return new Date(1995 + d, 10, 3);
  });

  var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(300)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(1998, 10, 3))
    .on('onchange', val => {
      d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
    });

  var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gTime.call(sliderTime);

  d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));
}

// function for dropdown menu
function dropDown(dataJSON) {

    var countries = ["European Union", "Belgium", "Germany"]

    // make dropdown
    var select = d3.select("#map")
                   .append("select")
  	               .attr("class","select")
                   .on("change", onchange)

    // fill dropdown with years as options
    var options = select
        .selectAll("option")
	    .data(countries).enter()
	    .append("option")
		.text(function (d) { return d; })

    // updategraph if other year chosen
    function onchange() {
    	var country = d3.select("select").property("value")
        var allData = prepareDataLine(dataJSON, country)
        var linechartList = allData[0]
        var years = allData[1]
        updateLine(linechartList, years)

    };
};

function updateLine(linechartList, years) {

    var line = d3.line()
                 .x(function(d, i) {
                     return xScale(years[i])
                 })
                 .y(function(d) {
                     return yScale(d)
                 });

    var newLine = d3.select(".linegraph").datum(linechartList);
    newLine.transition()
        .duration(500)
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "black");

    var newDots = d3.selectAll(".dot").data(linechartList);
    newDots.transition()
           .duration(500)
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

    var svg = makeLineSVG();

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
       .attr("fill", "#FFA500")
       .on("mouseover", function(a, b, c) {

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

function makeMap(countries, dataJSON, years) {
    // var amount = dataJSON["2007"][d.properties.NAME]["Share of renewable energy in gross final energy consumption"]

    // Set tooltips
    var tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 0])
                .html(function(d) {
                    if (dataJSON[minYear][d.properties.NAME] == undefined) {
                        return "<strong>Country: </strong><span class='details'>" + d.properties.NAME + "<br></span>" + "<strong> No data available </strong><span class='details'></span>"
                    } else {
                        return "<strong>Country: </strong><span class='details'>" + d.properties.NAME + "<br></span>" + "<strong>Share of renewable energy: </strong><span class='details'>" + dataJSON["2007"][d.properties.NAME]["Share of renewable energy in gross final energy consumption"] + "%" + "</span>";
                    }
                });


    var svg = makeMapSVG();

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

    var colorScheme = d3.schemeBlues[6];
    // colorScheme.unshift("#eee")
    var color = d3.scaleThreshold()
    .domain([1, 6, 11, 26, 100])
    .range(colorScheme);


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
       .style("fill", function(d){
         if (dataJSON["2007"][d.properties.NAME] == undefined) {
            return "#cc3300"
        } else {
            return (color(dataJSON["2007"][d.properties.NAME]["Share of renewable energy in gross final energy consumption"]))
        }
       })
       .on("mouseover",function(d){
           tip.show(d);
           d3.select(this)
             .style("opacity", 1)
             .style("stroke","white")
             .style("stroke-width",2);
        })
        .on('mouseout', function(d){
            tip.hide(d);
            d3.select(this)
              .style("opacity", 0.8)
              .style("stroke","white")
              .style("stroke-width",0.3);
        })
        .on("click", function(d, i) {
            if (dataJSON["2007"][d.properties.NAME] == undefined) {
                var country = "European Union (current composition)"
                var allData = prepareDataLine(dataJSON, country)
                var linechartList = allData[0]
                var years = allData[1]
                updateLine(linechartList, years)
            } else {
                console.log(d.properties.NAME)
                var allData = prepareDataLine(dataJSON, d.properties.NAME)
                var linechartList = allData[0]
                var years = allData[1]
                updateLine(linechartList, years)
            }

        });

      // svg.append("path")
      //     .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
      //      .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      //     .attr("class", "names")
      //     .attr("d", path);
    }
