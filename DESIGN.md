# Design document

## Data sources
The data source I will use is the following:  
[Eurostat - Share of renewable energy in gross final energy consumption by sector](https://ec.europa.eu/eurostat/tgm/refreshTableAction.do?tab=table&plugin=1&pcode=sdg_07_40&language=en)

To make the map, I will have to parse the data in such a way that the years are
the first dictionary key. This makes it possible to use the slider. The second
dictionary will have the country key. The value will be the percentage of the
total.

To make the piechart/sunburst I will have to get the values of the other sectors.
I will put all the values in another dictionary with the total percentage as a
key.

To make the line graph I will have to get the data for all the years for one
country. If a country is clicked on, the information of all years will be
selected. A line graph will be made with this information. A possibility is to
make a stacked line graph of all sectors.

## Diagram with overview of technical components



## Descriptions of each of the components and whats needed to implement
The top navigation bar is the first component. The homepage will have my
information and a small explanation about the visualization. The visualization
tab will have the visualizations.

The first component is the world map. For this a d3 file is needed. A tooltip
will be implemented to make the hover possible. Also a drop down menu to select
a country will be made. A slide bar will also be implemented to make it possible
to select a specific year. This will update the map.

If a country is clicked on, a sunburst/piechart will appear of that country and
that year. This will give the 3 sectors and their share. For this I will also
need to use D3.

If a country is clicked on, a stacked line graph will also appear. The line
graph will be a representation over the years for one country with the
different sectors.

## List of D3 plugins
* Topo
