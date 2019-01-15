window.onload = function() {

    // requests both queries and waits till all requests are fulfilled
    var womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
    var consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

    var requests = [d3.json(womenInScience), d3.json(consConf)];

    // executes a function
    Promise.all(requests).then(function(response) {

        // get data from response and calculate minimum and maximum
        var dataMSTI = transformResponse(response[0]);
        var minMaxMSTI = minMax(dataMSTI);
        var dataCons = transformResponse(response[1]);
        var minMaxCons = minMax(dataCons);

        // combine data from datasets into one dataset
        dataset = combineData(dataCons, dataMSTI);

        // make svg for later use
        svg = makeSVG();

        // get data for first year (2007)
        var yearData = dataYear(dataset, startYear)

        // make scale function for x
        var scaleX = d3.scaleLinear()
                       .domain([minMaxMSTI[0] - 1, minMaxMSTI[1] + 1])
                       .range([padding, width + padding]);

        // make scale function for y
        var scaleY = d3.scaleLinear()
                       .domain([minMaxCons[0] - 1, minMaxCons[1] + 1])
                       .range([height - padding, padding]);

        // make scatter for first year (2007)
        scatter(yearData, scaleX, scaleY)

        // make scatterlabels
        scatterLabels(scaleX, scaleY)

        // make legend for first year (2007)
        makeLegend(yearData, svg)

        // make dropdown menu
        dropDown(dataset, scaleX, scaleY, svg)

    }).catch(function(e){
        throw(e);
    });
};
