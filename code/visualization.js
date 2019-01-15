/*
Name: Xandra Vos
Studentnumber: 10731148
*/

window.onload = function() {

    // requests both queries and waits till all requests are fulfilled
    var jsonEurope = "https://raw.githubusercontent.com/xandravos/project/master/code/europe.json"
    var data = "https://raw.githubusercontent.com/xandravos/project/master/scripts/data.json"

    var requests = [d3.json(jsonEurope), d3.json(data)];
    console.log(requests)

    // executes a function
    Promise.all(requests).then(function(response) {
        console.log(response)
        // get data from response and calculate minimum and maximum
        // var dataMSTI = transformResponse(response[0]);
        // var minMaxMSTI = minMax(dataMSTI);
        // var dataCons = transformResponse(response[1]);
        // var minMaxCons = minMax(dataCons);


    }).catch(function(e){
        throw(e);
    });
};
