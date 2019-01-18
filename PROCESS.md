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

<!-- ![oldmap][] -->

## day 7 (17/1)
I found a JSON file for Europe only, so I didn't have to zoom. A few changes
made the Europe file work with the same d3-tip and javascript file. The Europe
map is shown below. Also a line graph is made. Now it is hardcoded for one
country. I was hesitating between a y axis that will be static (0-100) or
one that adjusts to the scale of the country. I chose the static one, because
otherwise it will paint a sketchy picture of the differences between the
countries.

<!-- ![newmap][] -->

## day 8 (18/1)
