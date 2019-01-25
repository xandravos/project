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
var minYear = "2007";
var maxYear = "2016";
var currentYear = "2007";

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
        var allCountries = Object.keys(dataJSON[minYear]).sort();

        var country = "European Union"

        var dataDonut = prepareDataDonut(country, currentYear, dataJSON)

        var lineData = prepareDataLine(dataJSON, country);
        var lineGraphList = lineData[0];
        var years = lineData[1];

        makeMap(jsonEurope, dataJSON, years);

        makeLineGraph(lineGraphList, years);

        dropDown(dataJSON, allCountries)

        makeSlider(years, dataJSON, jsonEurope)

        makeDonutChart(dataDonut)

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

function updateMap(dataJSON) {

    var colorScheme = d3.schemeBlues[6];
    var color = d3.scaleThreshold()
                  .domain([1, 6, 11, 26, 40, 100])
                  .range(colorScheme);

    var iets = d3.select(".countries").selectAll("path")
    iets.style("fill", function(d){
        if (dataJSON[currentYear][d.properties.NAME] == undefined) {
            return "#969696"
        } else {
            console.log(currentYear)
            return (color(dataJSON[currentYear][d.properties.NAME]["Share of renewable energy in gross final energy consumption"]));
        }
    })
}

function updateLegend(data) {
    var sectors = ["Transport", "Electricity", "Heating and cooling"];

    // make colors scale
    var colors = d3.scaleOrdinal()
                   .range(["#bdd7e7", "#6baed6" , "#2171b5"]);

    var newLegend = d3.selectAll("#donutLegend").data(data)

    newLegend.attr("fill", function (d) {
                  return colors(d);
              });
};

function makeLegend(data) {

    var sectors = ["Transport", "Electricity", "Heating and cooling"];

    // make colors scale
    var colors = d3.scaleOrdinal()
                   .range(["#bdd7e7", "#6baed6" , "#2171b5"]);

    // make group for legends
    var legends = d3.select(".donut")
                    .append("g")
                    .attr("transform", "translate(300, 20)")
                    .selectAll(".legends")
                    .data(data)

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
    legend.append("text")
          .attr("x", 80)
          .attr("y", 52)
          .attr("id", "legendText")
          .text(function(d, i){
              return sectors[i];
          })
};

function prepareDataDonut(country, year, dataJSON) {
    var countryYear = dataJSON[year][country]

    var dataDonut = []

    Object.keys(countryYear).forEach(function(key) {
        if (key != "Share of renewable energy in gross final energy consumption") {
            dataDonut.push(countryYear[key])
        }
    });
    return dataDonut;
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
                     var dataDonut = prepareDataDonut("European Union", val, dataJSON);
                     updateDonut(dataDonut);
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
            var allData = prepareDataLine(dataJSON, country);
            var lineGraphList = allData[0];
            var years = allData[1];
            updateLine(lineGraphList, years);

            var dataDonut = prepareDataDonut(country, currentYear, dataJSON);
            updateDonut(dataDonut);
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
           .attr("r", 5)
           .attr("fill", "#4292c6")

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

function makeLineGraph(data, years) {

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
       .attr("fill", "#4292c6")
       .on("mouseover", function(a, b, c) {
       })
       .on("mouseout", function() {
       })
}

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

    var svg = makeMapSVG();

    var path = d3.geoPath();

    var projection = d3.geoMercator()
                       .scale(435)
                       .translate([widthMap / 2 - 60, heightMap + 280]);

    var path = d3.geoPath().projection(projection);

    svg.call(tip);

    ready(countries, path, tip, dataJSON)
}

function ready(data, path, tip, dataJSON) {

    var eu = topojson.feature(data, data.objects.europe).features
    console.log(eu)
    var colorScheme = d3.schemeBlues[6];
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
                }, 3000);
                $("#linkClose").click(function() {
                    $("#alertCountry").hide("fade");
                });
                // var country = "European Union";
                // var allData = prepareDataLine(dataJSON, country);
                // var lineGraphList = allData[0];
                // var years = allData[1];
                // updateLine(lineGraphList, years);
            } else {
                var allLineData = prepareDataLine(dataJSON, d.properties.NAME);
                var lineGraphList = allLineData[0];
                var years = allLineData[1];
                updateLine(lineGraphList, years);

                var dataDonut = prepareDataDonut(d.properties.NAME, currentYear, dataJSON);
                updateDonut(dataDonut);
            }

        });

      // svg.append("path")
      //     .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
      //      .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      //     .attr("class", "names")
      //     .attr("d", path);
    }
