# Programming Project - Renewable Energy in Europe

Name: Xandra Vos  
Studentnumber: 10731148  
Course: Programmeerproject

## [GitHub Pages](https://xandravos.github.io/project/)

## Purpose
Climate change is a problem in the world which can't be
avoided anymore. That's why a lot of countries try to
contribute by investing in sustainable energy. In Europe
agreements are made between countries. However, not all
countries are as invested as others. That's why this
website gives information about the share of renewable
energy in the total energy consumption in the EU.

The overall share per country per year is presented in the
map. The overall share per country over the years 2007-2016
is presented in the line graph. The barchart gives the share
in three different sectors: transport, electricity, and
heating and cooling.

## Screenshots website
### Home
The top of the homepage is shown below. It contains the title with an image
related to the topic. Above the image it has a navigation bar. This makes is
possible to go to other html pages when clicked on them.
![top-home.png](https://github.com/xandravos/project/blob/master/doc/top-home.png)

The lower part of the homepage is shown below. This contains information and a
link to the GitHub repository.
![bottom-home.png](https://github.com/xandravos/project/blob/master/doc/bottom-home.png)

### Visualizations
The top of the visualizations page is shown below. It contains the navigation
bar which is the same as on the homepage, but now also has a dropdown menu
containing all countries. When a country is selected, the barchart and line
graph will update. It also contains a map of Europe which shows the share
of renewable energy countries consume on a blue colorscale. When hovering over
the countries, the data is shown. The countries which contain data also can be
clicked on, which updates the other visualizations. The slider underneath the
map gives the possibility to select another year. This updates the barchart
and the map. The legend for the barchart and map is placed next to the slider.
The barchart showes the share of renewable energy consumed in three sectors:
transport, electricity, and heating and cooling. This also has a tooltip when
hovering.
![top-visu.png](https://github.com/xandravos/project/blob/master/doc/top-visu.png)

The bottom of the visualizations page is shown below. It contains the line graph
of a country (default is European Union) from 2007 to 2016. It shows the course
of the share of sustainable energy of the gross final energy consumption. This
also contains a tooltip when hovering. When clicked on a dot, the barchart and
the map will update to the year that is clicked on.
![bottom-visu.png](https://github.com/xandravos/project/blob/master/doc/bottom-visu.png)

### About
The about page is shown below. It contains the same navigation bar as the other
pages. It also contains a paragraph about the problem and about the
visualizations with relating images.
![about.png](https://github.com/xandravos/project/blob/master/doc/about.png)

## Sources
The data used in the visualizations comes from [Eurostat](https://ec.europa.eu/eurostat/).
The file used for this visualization can be found [here](https://ec.europa.eu/eurostat/tgm/refreshTableAction.do?tab=table&plugin=1&pcode=sdg_07_40&language=en).

### Code
* Map: [JavaScript code making map and tooltip](http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f),
[europe.json](https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson).
* Legend: a combination of [this one](https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html)
and [this one](https://bl.ocks.org/duspviz-mit/9b6dce37101c30ab80d0bf378fe5e583).
* Barchart: [JavaScript code](https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3) and [tooltip](https://bl.ocks.org/wnghdcjfe/6377d75c963e8f841609a7bf6d3d0c74).
* Line graph: [Javascript code](https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89) and [tooltip](https://bl.ocks.org/wnghdcjfe/6377d75c963e8f841609a7bf6d3d0c74).
* Bootstrap elements: [Navbar](https://getbootstrap.com/docs/4.0/components/navbar/),
[Grid system](https://getbootstrap.com/docs/4.0/layout/grid/), [Alerts](https://www.w3schools.com/bootstrap/bootstrap_alerts.asp) and [Dropdown](https://www.w3schools.com/bootstrap/bootstrap_dropdowns.asp).
* Homepage: [Hero Image](https://www.w3schools.com/howto/howto_css_hero_image.asp)

### Plugins
* [Bootstrap](https://getbootstrap.com/)
* [D3](https://d3js.org/)
* [Pandas](https://pandas.pydata.org/)
* [D3-tip](https://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js)
* [jQuery](https://jquery.com/)

### Images
* [Favicon](https://www.flaticon.com/free-icons/renewable-energy)
* [Homepage](https://www.videoblocks.com/video/4k---ultra-hd-wind-power-turbine-windmill-energy-production---clean-and-renewable-energy-shot-on-red-buucwkr)
* [Glyphicons](https://getbootstrap.com/docs/3.3/components/)
* [About page first](https://kertupic.pw/alternative-power-sources-The-Earth-And-Climate-Change-in-2018.html)
* [About page second](https://crm.me/tour/more-features/reports-analytics/beautiful-visualizations/)

<p align="center">
Copyright 2019 Xandra Vos
<br>
Licensed under the terms of the MIT license.
</p>
