/**
* Name: Xandra Vos
* Studentnumber: 10731148
* Minor Programming
* Final Project
*
* JavaScript file to make all the visualizations.
*/



// Set variables for later use
var sectors = ["Transport", "Electricity", "Heating and cooling"];
var minYear = "2007";
var maxYear = "2016";
var currentYear = "2007";
var currentCountry = "European Union";
var barPadding = 18;

// Set margins, width and height for map
var marginMap = {top: -15, right: 0, bottom: 0, left: 0};
var widthMap = 500 - marginMap.left - marginMap.right;
var heightMap = 400 - marginMap.top - marginMap.bottom;

// Set margins, width and height for barchart
var marginBar = {top: 50, right: 100, bottom: 50, left: 100};
var widthBar = 400 - marginBar.left;
var heightBar = 500 - marginBar.top - marginBar.bottom;

// Set margins, width and height for line graph
var marginLine = {top: 20, right: 50, bottom: 50, left: 50};
var widthLine = window.innerWidth - marginLine.left - marginLine.right - 200;
var heightLine = window.innerHeight - marginLine.top - marginLine.bottom - 100;

// Create scale functions for barchart
var xScaled = d3.scaleLinear()
                .domain([0, 100])
                .range([marginBar.left, widthBar]);

var yScaled = d3.scaleBand()
               .domain(sectors)
               .range([heightBar - marginBar.top, marginBar.top]);

// Create scale functions for line graph
var xScale = d3.scaleLinear()
               .domain([minYear, maxYear])
               .range([0, widthLine]);

var yScale = d3.scaleLinear()
               .domain([0, 100])
               .range([heightLine, marginLine.top]);

// Start function when window loads
window.onload = function() {

    // Requests both queries and waits till all requests are fulfilled
    var jsonEurope = "https://raw.githubusercontent.com/xandravos/project/master/data/europe.json";
    var data = "https://raw.githubusercontent.com/xandravos/project/master/scripts/data.json";
    var requests = [d3.json(jsonEurope), d3.json(data)];
    var format = d3.format(",");

    // Executes function when all data is received
    Promise.all(requests).then(function(response) {

        // Gets data from function
        var jsonEurope = response[0];
        var dataJSON = response[1];

        // Puts countries in alphabetic order
        var allCountries = Object.keys(dataJSON[minYear]).sort();

        // Prepares data to make line graph
        var lineData = prepareDataLine(dataJSON, currentCountry);
        var lineGraphList = lineData[0];
        var years = lineData[1];

        // Prepares data for drawing barchart
        var dataBar = prepareDataBar(currentCountry, currentYear, dataJSON);

        // Runs all functions
        prepareMap(jsonEurope, dataJSON, years);
        makeBarchart(dataBar);
        makeLineGraph(lineGraphList, years, dataJSON);
        dropDown(dataJSON, allCountries);
        makeSlider(years, dataJSON, jsonEurope);

}).catch(function(e){
    throw(e);
});
};

// Function to prepare making map of EU
function prepareMap(countries, dataJSON, years) {

    // Set tooltips
    var tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 0])
                .html(function(d) {
                    if (dataJSON[currentYear][d.properties.NAME] == undefined) {
                        return "<strong>Country: </strong><span class='details'>" + d.properties.NAME + "<br></span>" + "<strong> No data available </strong><span class='details'></span>"
                    } else {
                        return "<strong>Country: </strong><span class='details'>" + d.properties.NAME + "<br></span>" + "<strong>Share of renewable energy: </strong><span class='details'>" + dataJSON[currentYear][d.properties.NAME]["Share of renewable energy in gross final energy consumption"] + "%" + "</span>";
                    }
                });

    // Create SVG for map
    var svg = d3.select("#map")
                .append("svg")
                .attr("width", widthMap)
                .attr("height", heightMap)
                .append("g")
                .attr("id", "worldmap");

    // Make projection
    var projection = d3.geoMercator()
                       .scale(390)
                       .translate([widthMap / 2 - 40, heightMap + 250])

    // Create path for drawing map
    var path = d3.geoPath()
                 .projection(projection)

    // Call tip
    svg.call(tip);

    // Make map
    makeMap(countries, path, tip, dataJSON)
}

// Function to make map of EU
function makeMap(data, path, tip, dataJSON) {

    // Get the right features of countries
    var eu = topojson.feature(data, data.objects.europe).features

    // Create colorscale
    var colorScheme = d3.schemeBlues[7];
    var color = d3.scaleThreshold()
                  .domain([1, 6, 11, 26, 50, 100])
                  .range(colorScheme);

    // Append path to map svg and make interactive
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
       .style("stroke","#737373")
       .style("stroke-width", 0.3)
       .style("fill", function(d){
           if (dataJSON[currentYear][d.properties.NAME] == undefined) {
               return "#969696"
           } else {
               return (color(dataJSON[currentYear][d.properties.NAME]["Share of renewable energy in gross final energy consumption"]));
           }
       })
       .on("mouseover",function(d){
           tip.show(d);
           d3.select(this)
             .style("opacity", 1)
             .style("stroke","#525252")
             .style("stroke-width",0.5);
        })
        .on('mouseout', function(d){
            tip.hide(d);
            d3.select(this)
              .style("opacity", 0.8)
              .style("stroke","#737373")
              .style("stroke-width",0.3);
        })
        .on("click", function(d, i) {
            if (dataJSON[currentYear][d.properties.NAME] == undefined) {
                $("#alertCountry").show("fade");
                setTimeout(function() {
                    $("#alertCountry").hide("fade");
                }, 4000);
                $("#linkClose").click(function() {
                    $("#alertCountry").hide("fade");
                });
            } else {
                currentCountry = d.properties.NAME;
                d3.select("#barTitle").text("Barchart of " + currentCountry + " in " + currentYear)
                d3.select("#lineTitle").text("Line graph of " + currentCountry + " 2007-2016")
                var allLineData = prepareDataLine(dataJSON, currentCountry);
                var lineGraphList = allLineData[0];
                var years = allLineData[1];
                updateLine(lineGraphList, years);

                var dataBar = prepareDataBar(currentCountry, currentYear, dataJSON);
                updateBar(dataBar)
            }
        });

        makeLegend()
};

// Function to make barchart
function makeBarchart(dataBar) {

    // Set variables for later use
    var canvasX = 400;
    var canvasY = 415;

    // Make svg for barchart
    var svg = d3.select("#barChart")
              .append("svg")
              .attr("width", canvasX)
              .attr("height", canvasY)
              .attr("class", "bars")

    // Make tooltip
    var tooltip = d3.select("#barChart")
                  .append("g")
                  .attr("class", "tooltipBar")
                  .style("opacity", 0);

    // Set colorscale for map
    var colorScheme = d3.schemeBlues[7];
    var colors = d3.scaleThreshold()
                  .domain([1, 6, 11, 26, 50, 100])
                  .range(colorScheme);

    // Make rectangles for barchart
    var svg = d3.select(".bars");
    svg.selectAll("rect")
       .attr("class", "rects")
       .data(dataBar)
       .enter()
       .append("rect")
       .attr("x", function(d, i) {
           return marginBar.left;
       })
       .attr("y", function(d, i) {
           return yScaled(sectors[i]);
       })
       .attr("width", function(d) {
           return (xScaled(d) - marginBar.left);
       })
       .attr("height", function(d) {
           return (widthBar / dataBar.length) - barPadding;
       })
       .attr("fill", function(d) {
           return colors(d);
       })
       .on("mouseover", function (d, i) {
           d3.select(this)
             .attr("fill", "#cc3300")
           tooltip.transition()
                  .duration(300)
                  .style("opacity", .9)
          tooltip.html("<strong>Sector: </strong><span class='details'>" + sectors[i] + "<br></span>" + "<strong>Share: </strong><spand class='details'></span>" + d + "%")
                 .style("right", (d3.event.pageX) + "px" + "px")
        })
        .on("mouseout", function (){
            d3.select(this)
                .attr("fill", function(d) {
                    return colors(d)
                })
            tooltip.transition()
                   .duration(200)
                   .style("opacity", 0)
        });

     // Make axis
     var xAxis = d3.axisBottom(xScaled)
     var yAxis = d3.axisLeft(yScaled)

     // Append ticks to x-axis
     d3.select(".bars")
       .append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + (heightBar - marginBar.top) + ")")
       .call(xAxis);

     // Append x-label
     d3.select(".bars")
       .append("text")
       .attr("class", "myLabelX")
       .attr("y", heightBar - 10)
       .attr("x", widthBar - 90)
       .attr('text-anchor', 'middle')
       .text("Share of renewable energy (%)");

     // Append ticks to y-axis
     d3.select(".bars")
       .append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + marginBar.left + ",0)")
       .call(yAxis)
       .selectAll("text")

     // Append y-label
     d3.select(".bars")
       .append("text")
       .attr("class", "myLabelY")
       .attr("y", 40)
       .attr("x", marginBar.left)
       .attr('text-anchor', 'middle')
       .text("Sectors");
};

// Function to make line graph
function makeLineGraph(data, years, dataJSON) {

    // Make SVG for line graph
    var svg = d3.select("#lineGraph")
                .append("svg")
                .attr("class", "lines")
                .attr("width", widthLine + marginLine.left + marginLine.right)
                .attr("height", heightLine + marginLine.top + marginLine.bottom)
                .append("g")
                .attr("transform", "translate(" + marginLine.left + "," + marginLine.top + ")");

    // Make tooltip
    var tooltip = d3.select("#lineGraph")
                    .append("g")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

    // Make line
    var line = d3.line()
                 .x(function(d, i) { return xScale(years[i])})
                 .y(function(d) { return yScale(d)});

    // Call the x axis
    svg.append("g")
       .attr("class", "x-axis")
       .attr("transform", "translate(0," + heightLine + ")")
       .call(d3.axisBottom(xScale).tickFormat(d3.format("")));

    // Call the y axis
    svg.append("g")
       .attr("class", "y-axis")
       .call(d3.axisLeft(yScale));

    // Append the path, bind the data, and call the line generator
    svg.append("path")
       .datum(data)
       .attr("class", "linegraph")
       .attr("d", line)
       .style("fill", "none")
       .style("stroke", "black");

    // Appends a circle for each datapoint and calls tooltip
    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("class", "dot")
       .attr("cx", function(d, i) { return xScale(years[i]) })
       .attr("cy", function(d) { return yScale(d) })
       .attr("r", 6)
       .attr("fill", "#4292c6")
       .on("mouseover", function (d, i) {
           d3.select(this)
             .style("fill", "#cc3300")
           tooltip.transition()
                  .duration(200)
                  .style("opacity", .9)
          tooltip.html("<strong>Year: </strong><span class='details'>" + years[i] + "<br></span>" + "<strong>Share: </strong><spand class='details'></span>" + d + "%")
                 .style("left", (d3.event.pageX) + "px")
                 .style("bottom", (d3.event.pageY) - "px")
        })
        .on("mouseout", function (){
            d3.select(this)
              .style("fill", "#4292c6")
            tooltip.transition()
                   .duration(200)
                   .style("opacity", 0)
        })
        .on("click", function (d, i) {
            currentYear = years[i]
            d3.select("#barTitle").text("Barchart of " + currentCountry + " in " + currentYear)
            d3.select("#mapTitle").text("Map of Europe in " + currentYear)
            var dataBar = prepareDataBar(currentCountry, currentYear, dataJSON);
            updateBar(dataBar);
            updateMap(dataJSON)
        })

    // Append x-label
    d3.select(".lines")
      .append("text")
      .attr("class", "labelLineX")
      .attr("y", heightLine + marginLine.bottom)
      .attr("x", (widthLine / 2) + marginLine.left)
      .attr('text-anchor', 'middle')
      .text("Years");

    // Append y-label
    d3.select(".lines")
      .append("text")
      .attr("class", "labelLineY")
      .attr("y", 18)
      .attr("x", -270)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text("Share of renewable energy (%)");
};

// Function to make dropdown menu in navbar
function dropDown(dataJSON, countries) {

    // Create list items with all countries as options
    var ul = document.getElementById("country-dropdown")
    countries.forEach(function(element) {
        var li = document.createElement("li");
        li.setAttribute("id", "countryOptions");
        li.appendChild(document.createTextNode(element));
        ul.appendChild(li);
    })

    // Update visualizations if clicked on a country
    document.getElementById("country-dropdown").addEventListener("click", function(element) {
    	var country = element.target.innerText;
        var checkClick = countries.includes(country);
        if (countries.includes(country)) {
            // Change current country
            currentCountry = country;

            // Change titles
            d3.select("#barTitle").text("Barchart of " + country + " in " + currentYear);
            d3.select("#lineTitle").text("Line graph of " + country + " 2007-2016");

            // Update barchart
            var dataBar = prepareDataBar(country, currentYear, dataJSON);
            updateBar(dataBar)

            // Update line graph
            var allData = prepareDataLine(dataJSON, country);
            var lineGraphList = allData[0];
            var years = allData[1];
            updateLine(lineGraphList, years);
        };
    });
};

// Function to make slider with years
function makeSlider(years, dataJSON, jsonEurope) {

    // Make options slider
    var sliderYears = d3.sliderBottom()
                        .min(d3.min(years))
                        .max(d3.max(years))
                        .width(400)
                        .tickFormat(d3.format(""))
                        .ticks(10)
                        .step(1)
                        .default(minYear)
                        .on("onchange", val => {
                             currentYear = val;
                             d3.select("#barTitle").text("Barchart of " + currentCountry + " in " + currentYear)
                             d3.select("#mapTitle").text("Map of Europe in " + currentYear)
                             var dataBar = prepareDataBar(currentCountry, currentYear, dataJSON);
                             updateBar(dataBar);
                             updateMap(dataJSON);
                        });

    // Create slider
    var gYears = d3.select("#slider-time")
                   .append("svg")
                   .attr("width", widthMap)
                   .attr("height", 100)
                   .append("g")
                   .attr("transform", "translate(30,30)");

    // Put options in slider
    gYears.call(sliderYears);
};

// Function to make legend
function makeLegend() {

    // Append SVG to container
    var svg = d3.select("#legendMap")
                .append("svg")
                .attr("class", "legend")
                .attr("width", widthBar)
                .attr("height", 100)


    // Append a defs element to SVG
    var defs = svg.append("defs");

    // Append a linearGradient element to the defs
    var linearGradient = defs.append("linearGradient")
                             .attr("id", "linear-gradient");

    // Make a horizontal gradient
    linearGradient.attr("x1", "0%")
                  .attr("y1", "0%")
                  .attr("x2", "100%")
                  .attr("y2", "0%");

    // Set first color for legend
    linearGradient.append("stop")
                  .attr("offset", "0%")
                  .attr("stop-color", "#eff3ff")
                  .attr("stop-opacity", 1);

    // Set second color for legend
    linearGradient.append("stop")
                  .attr("offset", "33%")
                  .attr("stop-color", "#bdd7e7")
                  .attr("stop-opacity", 1);

    // Set third color for legend
    linearGradient.append("stop")
                  .attr("offset", "66%")
                  .attr("stop-color", "#6baed6")
                  .attr("stop-opacity", 1);

    // Set last color for legend
    linearGradient.append("stop")
                  .attr("offset", "100%")
                  .attr("stop-color", "#2171b5")
                  .attr("stop-opacity", 1);

    // Draw the rectangle and fill with gradient
    svg.append("rect")
       .attr("id", "legendRect")
       .attr("width", 300)
       .attr("height", 20)
       .style("fill", "url(#linear-gradient)")
       .style("stroke", "#cccccc");

       // append text to legend
      svg.append("text")
             .attr("x", 20)
             .attr("y", 40)
             .attr("id", "legendText")
             .text("Share of renewable energy (0% - 100%)")
};

// Function to update map for selected year
function updateMap(dataJSON) {

    // Set colorscale for map
    var colorScheme = d3.schemeBlues[7];
    var color = d3.scaleThreshold()
                  .domain([1, 6, 11, 26, 50, 100])
                  .range(colorScheme);

    // Update map with new data
    var newMap = d3.selectAll(".countries").selectAll("path");
    newMap.style("fill", function(d){
        if (dataJSON[currentYear][d.properties.NAME] == undefined) {
            return "#969696";
        } else {
            return (color(dataJSON[currentYear][d.properties.NAME]["Share of renewable energy in gross final energy consumption"]));
        };
    });
};

// Function to update barchart for selected country and year
function updateBar(dataBar) {

    // Set colorscale for map
    var colorScheme = d3.schemeBlues[7];
    var colors = d3.scaleThreshold()
                  .domain([1, 6, 11, 26, 50, 100])
                  .range(colorScheme);

    // Give new data to bar
    var newBar = d3.selectAll(".bars").selectAll("rect").data(dataBar);
    newBar.transition()
          .duration(300)
          .attr("fill", function(d) {
              return colors(d);
          })
          .attr("width", function(d) {
              return (xScaled(d) - marginBar.left);
          });
};

// Function to update line graph
function updateLine(lineGraphList, years) {


    var tooltip = d3.select("#lineGraph")
                  .append("g")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

    // Make line
    var line = d3.line()
                 .x(function(d, i) {
                     return xScale(years[i]);
                 })
                 .y(function(d) {
                     return yScale(d);
                 });

    // Make new line with data for selected country
    var newLine = d3.select(".linegraph").datum(lineGraphList);
    newLine.transition()
           .duration(500)
           .attr("d", line)
           .style("fill", "none")
           .style("stroke", "black");

    // Make new dots with data for selected country
    var newDots = d3.selectAll(".dot").data(lineGraphList);
    newDots.transition()
           .duration(500)
           .attr("d", line)
           .attr("cx", function(d, i) { return xScale(years[i]) })
           .attr("cy", function(d) { return yScale(d) })
           .attr("r", 6)
           .attr("fill", "#4292c6")

    newDots.on("mouseover", function (d, i) {
        d3.select(this)
          .style("fill", "#cc3300")
        tooltip.transition()
               .duration(50)
               .style("opacity", .9);
        tooltip.html("<strong>Year: </strong><span class='details'>" + years[i] + "<br></span>" + "<strong>Share: </strong><spand class='details'></span>" + d + "%")
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY) - "px");
           })
           .on("mouseout", function (){
               d3.select(this)
                 .style("fill", "#4292c6")
               tooltip.transition()
                      .duration(200)
                      .style("opacity", 0);
           });
};

// Function to prepare data for bar
function prepareDataBar(country, year, dataJSON) {

    // Get data for chosen year and country
    var countryYear = dataJSON[year][country]

    // Make list and append needed data
    var dataBar = []
    Object.keys(countryYear).forEach(function(key) {
        if (key != "Share of renewable energy in gross final energy consumption") {
            dataBar.push(countryYear[key])
        }
    });
    return dataBar;
};

// Function to prepare data for line graph
function prepareDataLine(data, country) {

    // Get data
    var years = Object.keys(data);
    var countriesData = Object.values(data);

    // Make list and append needed data
    var lineGraphList = [];
    countriesData.forEach(function(d, i) {
        lineGraphList.push(d[country]["Share of renewable energy in gross final energy consumption"])
    });

    return [lineGraphList, years];
};
