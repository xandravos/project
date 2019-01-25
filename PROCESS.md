# Process book

## day 1 (9/1)
I decided to use Bootstrap to make it easier to make 2 visualizations next to
each other. It also makes it easier to make a navbar.

## day 2 (10/1)
I was ill, so I didn't do anything.

## day 3 (11/1)
I was still ill, but I managed to make the navbar work. Also I started parsing
the data. I used pandas for this, because I wanted to make nested dictionaries
and I used pandas before.

## day 4 (14/1)
The data is in JSON format. Now the world map should be made. I didn't manage
to make it. Trying another type.

## day 5 (15/1)
Made the style guide. Still no world map. Tried one, but nothing appears. I will
ask for help tomorrow.

## day 6 (16/1)
World map finally works. This is not the one I want, because it is the whole
world, but can't make the one work with only Europe in it. The one of the
world is shown below.

![oldmap](https://github.com/xandravos/project/blob/master/doc/oldworldmap.png)

## day 7 (17/1)
I found a JSON file for Europe only, so I didn't have to zoom. A few changes
made the Europe file work with the same d3-tip and javascript file. The Europe
map is shown below. Also a line graph is made. Now it is hardcoded for one
country. I was hesitating between a y axis that will be static (0-100) or
one that adjusts to the scale of the country. I chose the static one, because
otherwise it will paint a sketchy picture of the differences between the
countries.

![newmap](https://github.com/xandravos/project/blob/master/doc/neweumap.png)

## day 8 (18/1)
I wanted to make it possible to click on a country and update the line graph, so
the graph of the country that was clicked on appears. At first, it didn't work,
but now the graph updates. The next step is the dropdown menu. This will also
make it possible to select a country and update the line graph. My new
choice is if I want a line to be present before selecting anything or having
an empty graph.

## day 9 (21/1)
The dropdown menu works. All the countries are now in there and the line graph
updates when a country is selected. Also the slider is implemented. It doesn't
work with updating the other visualizations, but this will be work for later.
Also implemented a favicon and glyphicons on the webpage.

## day 10 (22/1)
Made the piechart. Used the same colors as in the map and the line graph to make
one whole of the page. Tried to make the piechart updatable, but it doesn't
work yet.

## day 11 (23/1)
Made a legend next to the piechart. Also created marges between the glyphicons
and the text next to them. The dropdown is now positioned in the navbar. This
couldn't be done with bootstrap or JS only, so I had to combine, which took a
while. Got text in the piechart and piechart is updatable. Also give an alert
box when a country without data is selected. jQuery was needed for this.  

I want the tooltip of the map to stay next to the cursor.

## day 12 (24/1)
Things to do:  
* Tooltip map (relative)
* Stacked barchart instead of piechart?
* Slider
* Tooltip line graph
* Tooltip piechart
