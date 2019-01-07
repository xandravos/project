# Project Minor Programming
## Sustainable energy map
Name: Xandra Vos  
Studentnumber: 10731148

### Summary
I want to visualize the consumption of renewable energy of EU countries. It
should be easy to understand and contain a complete summary of the share of
the different sectors on the consumption over the years.

### Problem statement
I think there is a lack of knowledge about the share of renewable energy of EU
countries on the total energy consumption. That's why I want to summarize
this in a visualization.

### Solution
**Summary**  
I want to make a visualization with a world map which gives insight in the share
of renewable energy consumption on the total energy consumption of EU countries.

**Visual sketch**
https://github.com/xandravos/project/files/2732918/Presentatie1.pdf


#### Features
**MVP**
* A world map of Europe
* The share of renewable energy in gross final energy consumption per EU country
* The option to view it by sector in a sunburst
* The option to view it over the years in a line graph for one country
* The option to hover over the countries on the world map to see information pop up (country + %)
* A slider for the world map to see a specific year
* The option of a drop down menu for the line chart to select sectors

**Optional**
* A globe
* The GDP of the country
* What the potentials of the country would be in terms of sustainable energy

### Prerequisites
#### Data sources
* This is data I could use: [eurostat](https://ec.europa.eu/eurostat/tgm/refreshTableAction.do?tab=table&plugin=1&pcode=sdg_07_40&language=en).
* This is other data I could use: [European Environment Agency](https://www.eea.europa.eu/data-and-maps/indicators/renewable-gross-final-energy-consumption-4/assessment-3).

#### External components
I will need D3 for the world map, the line graph and the sunburst.

#### Similar
We got links to some old projects. I think mine will be a bit like [this one](https://jaspernaberman.github.io/Programming-Project/Scripts/HTML/visualizations.html).
In these visualizations the amount of immigrants in 2015 per EU country are
visualized. Also the different kinds of immigrants are visualized.
I want to do a longer explanation for the sunburst, because this one is not so
readable I think. Also, I want to do a line graph instead of a barchart.

#### Hardest parts
I think getting the right data will be hard. Also, if I want to enlarge it to
the world instead of only the EU, I maybe want to make a globe instead of a
world map. This will be hard.
