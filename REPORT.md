# Report
Xandra Vos - 10731148
University of Amsterdam
Minor Programmeren
Final Project

## Short description
My application contains a map of Europe, a horizontal barchart and a line graph.
These all give insight about the share of renewable energy in the final energy
consumption of all EU countries. It also gives insight about three sectors and
their share of renewable energy: heating and cooling, electricity and transport.

![screenshot](https://github.com/xandravos/project/blob/master/doc/top-home.png)

## Technical design
### Converting to JSON
The script used to convert the CSV file into a JSON file is convertCSV2JSON.py.
This file also puts the data into a practical dictionary so it't easier to use
in JavaScript. The CSV file is called data.csv and the JSON file is called
data.json. All these files can be found in the scripts folder.

### Overview
#### HTML
Three HTML files have been made to make the website which are placed in the
html folder inside the code folder.
* index.html - contains all components of the homepage.
* visualization.html - contains all components of the visualization page.
* about.html - contains all components of with the story behind the data.

#### JavaScript
The code folder also contains a js (JavaScript) folder. This folder contains
one selfmade file and two borrowed files.
* visualization.js (selfmade) - contains all functions to make the visualizations
(more over later).
* d3-tip.js (borrowed) - contains code for the tooltip of the map.
* d3 (folder, borrowed) - this folder contains the files to make use of the D3 library.

#### CSS
The css folder is also placed in the code folder and contains three css files.
* index.css - which styles the index.html page.
* visualization.css - styles the visualization.html page.
* about.css - styles the about.html page.

### Detailed description
#### HTML
All HTML pages have been made using [Bootstrap](https://getbootstrap.com/).
All pages have a navigation bar at the top what makes it easy to navigate
through the website. When clicked on another tab, the related HTML page will load.
Another feature used with bootstrap is the rows and columns, which makes it
easier to place components at the right position on the page. More Bootstrap
features are the alert message and the dropdown menu on the visualizations page.

#### JavaScript
As mentioned above, the visualization.js file is the only JavaScript file which
is selfmade. That's why this will be the only one that will be discussed. It
contains all functions to make the visualizations. The functions are in
importance order. So all the preparing data functions are at the bottom of the
file, the making of the visualizations functions are at the top and the
functions to update the visualizations are in the middle.

##### General functions
* window.onload - this makes it possible to make sure the functions run after
the page is loaded so it doesn't happen at the same time.

* Promise.all() - this makes sure the files needed for the visualizations are
found and loaded before starting the rest of the functions.

##### Prepare data
* prepareDataBar() - this function prepares the data to be used for the barchart.
It has three arguments: country, year, dataJSON. The country and the year are
chosen at first (European Union, 2007) and can be changed by the user. The dataJSON
arguments is the dictionary which was made by python and put into a JSON file.
The function returns an array with length 3.

* prepareDataLine() - this function prepares the data to be used to make the
line graph. It has two arguments: data and country. Country is also the EU at first,
but can be changed by the user. Data is the same as at the prepareDataBar()
function. The function returns an array with a length of 10 (for all years a
value) and all years to use for the x-axis.

##### Make visualizations
* prepareMap() - this function prepares everything before start making the map.
It creates the tooltip, svg, projection, path and then calls the makeMap()
function.

* makeMap() - this function creates the map with all interactivity. The
interactions for the user are hovering over the map which gives information
about the countries. When clicked on a country, the other visualizations and
their titles will update.

* makeBarchart() - this function creates the barchart. The barchart
gives insight about the three sectors (heating and cooling, transport, and
electricity) and their share of renewable energy in the total consumed energy.
When hovering over the barchart, the information is shown in a tooltip.

* makeLineGraph() - this function creates the line graph. The dots in the line
graph are interactive. Hovering shows a tooltip and clicking updates the worldmap
and the barchart.

* dropDown() - this function uses the Bootstrap dropdown template to make a
dropdown menu in the navigation bar. When a country is selected the barchart,
the line graph, and their titles will update.

* makeSlider() - this function makes the slider. The slider contains 10 years
(2007-2016) and it makes it possible to select a different year. The map, the
barchart, and their titles update when a new year is selected

* makeLegend() - this function creates the legend for the barchart and the map
because both have the same colorscale.

##### Update visualizations
* updateMap() - this function updates the map when another year is selected in
the slider or in the line graph.

* updateBar() - this function updates the barchart when another year is selected
in the slider or in the graph and also when another country is selected in the
dropdown menu or in the map.

* updateLine() - this function updates when another country is selected in the
dropdown menu or in the map.

## Challenges during development
At first I didn't know where to start with making the navigation bar and
how to get the place all the visualizations where I wanted them. Then I
decided to use bootstrap which made it much easier but I had to get used to it
which took some time.

I wanted to make the map of the EU, but this took a long time. I wanted to have
a detailed map of the EU but I could only find a world map which had the
possibility to zoom on the Europe part of the map. I didn't want this, so it took
me till the end of week 2 to finish the map. This was a big challenge for me.

Making the dropdown menu in the navigation bar with all countries as options
also was a challenge. This wasn't as easy as I thought because D3 and Bootstrap
don't make it possible to collaborate them. I had to hardcode it in Bootstrap or
make a dropdown menu outside of the navbar. I found a way to put list items in
the dropdown menu and also to make it possible to click on them.

The biggest challenge was probably the piechart. I wanted to make a piechart of
the three sectors. After making the piechart and putting in a lot of time and
effort, I discovered that my data isn't suitable for a piechart. That's why
had to make a barchart last minute. I wasn't really satisfied, but I didn't have
enough time to change it.

## Defense
Before I started I wanted to make a sunburst. I changed this into a piechart,
because I didn't have enough time. I think this was a good choice, because it
would take some time to make the sunburst and I wouldn't have made it to finish
the rest of the website. If I had more time I would put all functions in
separate files so the structure would be clearer. Also I would try to make a
stacked area graph instead of the line graph and barchart and find new data for
a sunburst or piechart.
