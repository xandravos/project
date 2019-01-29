/*
Name: Xandra Vos
Studentnumber: 10731148
*/

// Set margins, width and height for map
var marginMap = {top: -15, right: 0, bottom: 0, left: 0};
var widthMap = 500 - marginMap.left - marginMap.right;
var heightMap = 400 - marginMap.top - marginMap.bottom;

// Set margins, width and height for line graph
var marginLine = {top: 20, right: 50, bottom: 50, left: 50};
var widthLine = window.innerWidth - marginLine.left - marginLine.right - 200;
var heightLine = window.innerHeight - marginLine.top - marginLine.bottom - 100;

// Set margins, width and height for barchart
var marginBar = {top: 50, right: 100, bottom: 50, left: 100};
var widthBar = 500 - marginBar.left;
var heightBar = 400 - marginBar.top - marginBar.bottom;

// Set variables for later use
var sectors = ["Transport", "Electricity", "Heating and cooling"];
var minYear = "2007";
var maxYear = "2016";
var currentYear = "2007";
var currentCountry = "European Union";

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
    var jsonEurope = "https://raw.githubusercontent.com/xandravos/project/master/code/europe.json";
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
        makeMap(jsonEurope, dataJSON, years);
        makeBarchart(dataBar);
        dropDown(dataJSON, allCountries);
        makeSlider(years, dataJSON, jsonEurope);
        makeLineGraph(lineGraphList, years);

}).catch(function(e){
    throw(e);
});
};

function updateDonut(dataDonut) {

    var colors = d3.scaleOrdinal()
                   .range(["#bdd7e7", "#6baed6" , "#2171b5"]);

    var arc = d3.arc()
                .innerRadius(50)
                .outerRadius(150)

    var data = d3.pie()(dataDonut)

    var newArcs = d3.select(".donutArcs").selectAll("path").data(data)

    // newArcs
    newArcs.attr("d", arc)
           .attr("fill", function (d) {
               return colors(d.data)
            })
           .transition()
           .duration(function(d, i) {
               return i * 800;
           })
           .attrTween('d', function(d) {
               var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
               return function(t) {
                   d.endAngle = i(t);
                   return arc(d);
               };
           });

    var newContent = d3.selectAll(".donutText")
                       .data(data)
                       .text(function(d) {
                           return (d.data + "%")
                       });

    // updateLegend(dataDonut)
}

function makeBarchart(valuesBar) {

    var canvasX = 500;
    var canvasY = 400;
    var barPadding = 18;

    // make svg in container
    var svg = d3.select("#barChart")
              .append("svg")
              .attr("width", canvasX)
              .attr("height", canvasY)
              .attr("class", "bars")


    var colors = d3.scaleOrdinal(d3.schemeSet2);

    // make rectangles for barchart
    var svg = d3.select(".bars");
    svg.selectAll("rect")
       .attr("class", "rects")
       .data(valuesBar)
       .enter()
       .append("rect")
       .attr("x", function(d, i) {
           return marginBar.left;
           // return (i * ((width - xPadding)/ valuesBar.length) + xPadding + 1);
       })
       .attr("y", function(d, i) {
           return yScaled(sectors[i]);
       })
       .attr("width", function(d) {
           return (xScaled(d) - marginBar.left);
           // return (width / valuesBar.length) - barPadding - 50
       })
       .attr("height", function(d) {
           // return (height - yScaled(sectors[i]) - yPadding);
           return (widthBar / valuesBar.length) - barPadding - 50;
       })
       .attr("fill", function(d) {
           return colors(d);
       })
       // .attr("transform", "translate(200, 20) rotate(90)");


     var xAxis = d3.axisBottom(xScaled)
     var yAxis = d3.axisLeft(yScaled)

     // append ticks to x-axis
     d3.select(".bars")
       .append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + (heightBar - marginBar.top) + ")")
       .call(xAxis);

     // append x-label
     d3.select(".bars")
       .append("text")
       .attr("class", "myLabelX")
       .attr("y", heightBar - 10)
       .attr("x", widthBar - 150)
       .attr('text-anchor', 'middle')
       .text("Share of renewable energy (%)")

     // append ticks to y-axis
     d3.select(".bars")
       .append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + marginBar.left + ",0)")
       .call(yAxis);

     // append y-label
     d3.select(".bars")
       .append("text")
       .attr("class", "myLabelY")
       .attr("y", 25)
       .attr("x", -150)
       .attr('transform', 'rotate(-90)')
       .attr('text-anchor', 'middle')
       .text("Sectors")

};

function updateMap(dataJSON) {

    var colorScheme = d3.schemeBlues[7];
    var color = d3.scaleThreshold()
                  .domain([1, 6, 11, 26, 50, 100])
                  .range(colorScheme);

    var newMap = d3.selectAll(".countries").selectAll("path")
    newMap.style("fill", function(d){
        if (dataJSON[currentYear][d.properties.NAME] == undefined) {
            return "#969696"
        } else {
            return (color(dataJSON[currentYear][d.properties.NAME]["Share of renewable energy in gross final energy consumption"]));
        };
    });
};

function updateLegend(data) {

    // make colors scale
    var colors = d3.scaleOrdinal()
                   .range(["#bdd7e7", "#6baed6" , "#2171b5"]);

    var newLegend = d3.selectAll("#donutLegend").data(data)

    newLegend.attr("fill", function (d) {
                  return colors(d);
              });
};

function makeLegend() {


    var colorScheme = d3.schemeBlues[7];
    var colors = d3.scaleThreshold()
                  .domain([1, 6, 11, 26, 50, 100])
                  .range(colorScheme);

    // make group for legends
    var legends = d3.select("#map")
                    .append("g")
                    .attr("transform", "translate(300, 20)")
                    .selectAll(".legends")


    // make legend
    var legend = legends.enter()
                        .append("g")
                        .classed("legends", true)
                        .attr("transform", function(d, i){
                            return "translate(0," + i*20 +")";
                        });

    // append circles to legend
    legend.append("circle")
          .attr("id", "donutLegend")
          .attr("cx", 70)
          .attr("cy", 50)
          .attr("r", 5)
          .attr("fill", function (d) {
              return colors(d);
          });

    // append text to legend
    // legend.append("text")
    //       .attr("x", 80)
    //       .attr("y", 52)
    //       .attr("id", "legendText")
    //       .text(function(d, i){
    //           return sectors[i];
    //       })
};

function prepareDataBar(country, year, dataJSON) {
    var countryYear = dataJSON[year][country]

    var dataBar = []

    Object.keys(countryYear).forEach(function(key) {
        if (key != "Share of renewable energy in gross final energy consumption") {
            dataBar.push(countryYear[key])
        }
    });
    return dataBar;
}

function makeSlider(years, dataJSON, jsonEurope) {

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
                     var dataBar = prepareDataBar("European Union", val, dataJSON);
                     d3.select("#barTitle").text("Barchart of " + currentCountry + " in " + currentYear)
                     d3.select("#mapTitle").text("Map of Europe in " + currentYear)
                     // updateDonut(dataDonut);
                     updateMap(dataJSON);
                 });

    var gYears = d3.select("#slider-time")
                   .append("svg")
                   .attr("width", widthMap)
                   .attr("height", 100)
                   .append("g")
                   .attr("transform", "translate(30,30)");

    gYears.call(sliderYears);

    // d3.select("#value-step").text(sliderYears.value());

}

function dropDown(dataJSON, countries) {
    var ul = document.getElementById("country-dropdown")
    countries.forEach(function(element) {
        var li = document.createElement("li");
        li.setAttribute("id", "countryOptions")
        li.appendChild(document.createTextNode(element));
        ul.appendChild(li);
    })

    document.getElementById("country-dropdown").addEventListener("click", function(element) {
    	var country = element.target.innerText;
        var checkClick = countries.includes(country)
        if (countries.includes(country)) {
            d3.select("#barTitle").text("Barchart of " + country + " in " + currentYear)
            d3.select("#lineTitle").text("Line graph of " + country + " 2007-2016")
            currentCountry = country;
            var allData = prepareDataLine(dataJSON, country);
            var lineGraphList = allData[0];
            var years = allData[1];
            updateLine(lineGraphList, years);

            var dataBar = prepareDataBar(country, currentYear, dataJSON);
            // updateDonut(dataDonut);

            currentCountry = country;
        };
    });
};

function updateLine(lineGraphList, years) {

    var line = d3.line()
                 .x(function(d, i) {
                     return xScale(years[i])
                 })
                 .y(function(d) {
                     return yScale(d)
                 });

    var newLine = d3.select(".linegraph").datum(lineGraphList);
    newLine.transition()
        .duration(500)
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "black");

    var newDots = d3.selectAll(".dot").data(lineGraphList);
    newDots.transition()
           .duration(500)
           .attr("d", line)
           .attr("cx", function(d, i) { return xScale(years[i]) })
           .attr("cy", function(d) { return yScale(d) })
           .attr("r", 6)
           .attr("fill", "#4292c6")
           .on("mouseover", function (d, i) {
               tooltip.transition()
                     .duration(50)
                     .style("opacity", .9)
              tooltip.html("Year: " + years[i] + "<br>Share: " + d + "%")
                     .style("left", (d3.event.pageX) + "px")
                     .style("top", (d3.event.pageY) - "px")
           })
           .on("mouseout", function (){
               tooltip.transition()
                      .duration(200)
                      .style("opacity", 0)
           });
}

function makeLineGraph(data, years) {

    var heightSVG = 400;
    var widthSVG = 700;

    var svg = d3.select("#lineGraph")
                .append("svg")
                .attr("class", "lines")
                .attr("width", widthLine + marginLine.left + marginLine.right)
                .attr("height", heightLine + marginLine.top + marginLine.bottom)
                .append("g")
                .attr("transform", "translate(" + marginLine.left + "," + marginLine.top + ")");

    var tooltip = d3.select("#lineGraph")
                    .append("g")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

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

    // Appends a circle for each datapoint
    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("class", "dot")
       .attr("cx", function(d, i) { return xScale(years[i]) })
       .attr("cy", function(d) { return yScale(d) })
       .attr("r", 6)
       .attr("fill", "#4292c6")
       .on("mouseover", function (d, i) {
           tooltip.transition()
                  .duration(200)
                  .style("opacity", .9)
          tooltip.html("Year: " + years[i] + " <br>Share: " + d + "%")
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY) - "px")
        })
        .on("mouseout", function (){
            tooltip.transition()
                   .duration(200)
                   .style("opacity", 0)
        });

    d3.select(".lines")
      .append("text")
      .attr("class", "labelLineX")
      .attr("y", heightLine + marginLine.bottom)
      .attr("x", (widthLine / 2) + marginLine.left)
      .attr('text-anchor', 'middle')
      .text("Years");

    // append y-label
    d3.select(".lines")
      .append("text")
      .attr("class", "labelLineY")
      .attr("y", 18)
      .attr("x", -270)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text("Share of renewable energy (%)");
};

function prepareDataLine(data, country) {
    var dataEn = data;
    var years = Object.keys(dataEn);
    var countriesData = Object.values(dataEn);

    lineGraphList = []
    countriesData.forEach(function(d, i) {
        lineGraphList.push(d[country]["Share of renewable energy in gross final energy consumption"])
    });

    return [lineGraphList, years];
}

function makeDonutChart(dataDonut) {
    // make color scale and set height

    var colors = d3.scaleOrdinal()
                   .range(["#bdd7e7", "#6baed6" , "#2171b5"]);

    // var colors = d3.scaleOrdinal(d3.schemePuBuGn[3])
    var width = 500;
    var height = 500;

    // make svg for donutchart
    var svg = d3.select("#donutChart")
                .append("svg")
                .attr("class", "donut")
                .attr("width", width)
                .attr("height", height)

    // make data for donutchart
    var data = d3.pie()(dataDonut)

    // make donut
    var arc = d3.arc()
                .innerRadius(50)
                .outerRadius(150)

    // make parts of donut
    var arcs = svg.append("g")
                  .attr("class", "donutArcs")
                  .attr("transform", "translate(250, 250)")
                  .attr("stroke", "white")
                  .selectAll("path")
                  .data(data)

    // fill arcs of donut
    arcs.enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function (d) {
            return colors(d.data)
        })
        .transition()
        .duration(function(d, i) {
            return i * 800;
        })
        .attrTween('d', function(d) {
            var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
            return function(t) {
                d.endAngle = i(t);
                return arc(d);
            }
        })

    // make place for text in donut
    var content = d3.select(".donutArcs")
                    .selectAll("text")
                    .data(data);

    // write text in donut
    content.enter()
           .append("text")
           .attr("class", "donutText")
           .each(function(d) {
               var center = arc.centroid(d);
               d3.select(this)
                 .attr("x", center[0])
                 .attr("y", center[1])
                 .text(d.data + "%")
           });

    makeLegend(dataDonut)
}

function makeMap(countries, dataJSON, years) {

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

    var svg = d3.select("#map")
                .append("svg")
                .attr("width", widthMap)
                .attr("height", heightMap)
                .append("g")
                .attr("id", "worldmap");

    var path = d3.geoPath();

    var projection = d3.geoMercator()
                       .scale(400, 100)
                       .translate([widthMap / 2 - 40, heightMap + 250]);

    var path = d3.geoPath().projection(projection);

    svg.call(tip);

    ready(countries, path, tip, dataJSON)
}

function ready(data, path, tip, dataJSON) {

    var eu = topojson.feature(data, data.objects.europe).features
    console.log(eu)
    var colorScheme = d3.schemeBlues[7];
    var color = d3.scaleThreshold()
                  .domain([1, 6, 11, 26, 50, 100])
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
                d3.select("#barTitle").text("Barchart of " + d.properties.NAME + " in " + currentYear)
                d3.select("#lineTitle").text("Line graph of " + d.properties.NAME + " 2007-2016")
                var allLineData = prepareDataLine(dataJSON, d.properties.NAME);
                var lineGraphList = allLineData[0];
                var years = allLineData[1];
                updateLine(lineGraphList, years);

                var dataBar = prepareDataBar(d.properties.NAME, currentYear, dataJSON);
                currentCountry = d.properties.NAME;
            }
        });

        // makeLegend()
    }
